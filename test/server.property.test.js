// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// Property-based tests of the server, with fast-check. They run the real
// handlers from src/server.js on an in-process vscode-languageserver
// connection over memory streams, feed it generated JSON-RPC traffic cut
// into arbitrary byte chunks, and check what an editor relies on: every
// request gets exactly one answer with its own id, `initialize` always
// names the server, an unknown method is refused without breaking the
// session, and nothing the client sends is echoed back. The weak-secret
// diagnostics and the code action are not built yet; their properties
// join this file with them.

import { PassThrough } from "node:stream";
import { expect } from "chai";
import fc from "fast-check";
import {
  createConnection,
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-languageserver/node";
import { attach, initializeResult, SERVER_INFO } from "../src/server.js";
import { frame, parseFrames } from "./support/lsp-process.js";

const METHOD_NOT_FOUND = -32601;
// What vscode-languageserver adds to the capabilities the server returns:
// textDocumentSync None, since no document handler is registered yet.
const CAPABILITIES = { textDocumentSync: 0 };
// Methods the connection itself handles, which an "unknown method" must
// not be.
const HANDLED = new Set(["initialize", "shutdown", "exit"]);

/**
 * Starts the server's handlers on an in-process connection. `send` writes
 * bytes to it in the given chunks; `responses(n)` resolves once it has
 * written n messages; `output()` is every byte it has written, as text.
 */
function startServer() {
  const input = new PassThrough();
  const output = new PassThrough();
  const connection = attach(
    createConnection(
      new StreamMessageReader(input),
      new StreamMessageWriter(output),
    ),
  );
  connection.listen();
  const state = { buffer: Buffer.alloc(0), raw: "", messages: [] };
  const waiters = [];
  output.on("data", (chunk) => {
    state.raw += chunk.toString("utf8");
    const { messages, rest } = parseFrames(
      Buffer.concat([state.buffer, chunk]),
    );
    state.buffer = rest;
    state.messages.push(...messages);
    waiters.forEach((wake) => wake());
  });
  return {
    send(chunks) {
      chunks.forEach((chunk) => input.write(chunk));
    },
    responses(count) {
      return new Promise((resolve) => {
        const check = () =>
          state.messages.length >= count && resolve(state.messages);
        waiters.push(check);
        check();
      });
    },
    output: () => state.raw,
    close: () => connection.dispose(),
  };
}

/** Cuts `bytes` into chunks at the given (unsorted, repeatable) offsets. */
function cut(bytes, offsets) {
  const points = [...new Set(offsets.map((o) => o % (bytes.length + 1)))];
  points.sort((a, b) => a - b);
  const chunks = [];
  let start = 0;
  for (const point of [...points, bytes.length]) {
    chunks.push(bytes.subarray(start, point));
    start = point;
  }
  return chunks.filter((chunk) => chunk.length > 0);
}

/** Sends `requests` to a fresh server and returns its answers. */
async function exchange(requests, offsets) {
  const server = startServer();
  try {
    server.send(cut(Buffer.concat(requests.map(frame)), offsets));
    const messages = await server.responses(requests.length);
    return { messages, raw: server.output() };
  } finally {
    server.close();
  }
}

const ids = fc.oneof(fc.integer(), fc.string({ unit: "binary" }));
const offsets = fc.array(fc.nat(), { maxLength: 12 });
const text = fc.string({ unit: "binary", maxLength: 40 });
// A synthetic secret, distinctive enough that it cannot occur in an
// answer by chance, from characters JSON writes unescaped, so a leak
// shows up verbatim in the bytes the server writes.
const secrets = fc
  .stringMatching(/^[\w!#$%&'()*+,./:;<=>?@^`{|}~-]{8,40}$/)
  .map((s) => `synthetic-secret-${s}`);
const unknownMethods = fc
  .string({ unit: "binary", minLength: 1, maxLength: 30 })
  .filter((m) => !HANDLED.has(m) && !m.startsWith("$/"));

/** `initialize` params as an editor might send them. */
function initializeParams(clientName, secret) {
  return {
    processId: null,
    rootUri: null,
    capabilities: {},
    clientInfo: { name: clientName },
    initializationOptions: { token: secret },
  };
}

const initializeAnswers = fc.asyncProperty(
  ids,
  text,
  secrets,
  offsets,
  async (id, clientName, secret, cuts) => {
    const request = {
      jsonrpc: "2.0",
      id,
      method: "initialize",
      params: initializeParams(clientName, secret),
    };
    const { messages, raw } = await exchange([request], cuts);

    expect(raw).to.not.include(secret);
    expect(messages).to.deep.equal([
      {
        jsonrpc: "2.0",
        id,
        result: { capabilities: CAPABILITIES, serverInfo: SERVER_INFO },
      },
    ]);
  },
);

const unknownRefused = fc.asyncProperty(
  unknownMethods,
  ids,
  ids,
  offsets,
  async (method, unknownId, initId, cuts) => {
    fc.pre(unknownId !== initId);
    const { messages } = await exchange(
      [
        { jsonrpc: "2.0", id: unknownId, method, params: {} },
        {
          jsonrpc: "2.0",
          id: initId,
          method: "initialize",
          params: initializeParams("fuzz", "synthetic-secret-x"),
        },
      ],
      cuts,
    );

    expect(messages).to.have.length(2);
    expect(messages[0].id).to.deep.equal(unknownId);
    expect(messages[0].error.code).to.equal(METHOD_NOT_FOUND);
    expect(messages[0]).to.not.have.property("result");
    expect(messages[1].id).to.deep.equal(initId);
    expect(messages[1].result.serverInfo).to.deep.equal(SERVER_INFO);
  },
);

const resultIsolated = fc.property(
  fc.dictionary(fc.string(), fc.jsonValue()),
  fc.dictionary(fc.string(), fc.jsonValue()),
  (capabilities, serverInfo) => {
    const before = structuredClone(initializeResult());
    const mutated = initializeResult();
    Object.assign(mutated.capabilities, capabilities);
    Object.assign(mutated.serverInfo, serverInfo);

    expect(initializeResult()).to.deep.equal(before);
    expect(before.serverInfo).to.deep.equal(SERVER_INFO);
  },
);

describe("server properties (fast-check)", () => {
  it("answers any initialize, however framed, without echoing a secret", () =>
    fc.assert(initializeAnswers));

  it("refuses any unknown method and keeps serving", () =>
    fc.assert(unknownRefused));

  it("returns an initialize result a caller cannot use to alter the next", () =>
    fc.assert(resultIsolated));
});
