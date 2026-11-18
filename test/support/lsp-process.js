// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// A minimal LSP client for the tests: spawns bin/jspassgen-lsp.js and
// speaks JSON-RPC with Content-Length framing over its stdio. Written by
// hand rather than with vscode-jsonrpc, so the tests check the wire format
// independently of the library the server uses.

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const BIN = fileURLToPath(
  new URL("../../bin/jspassgen-lsp.js", import.meta.url),
);
const SEPARATOR = "\r\n\r\n";

/** Encodes one JSON-RPC message as an LSP frame. */
export function frame(message) {
  const body = Buffer.from(JSON.stringify(message), "utf8");
  const header = Buffer.from(`Content-Length: ${body.length}${SEPARATOR}`);
  return Buffer.concat([header, body]);
}

/** Splits complete frames off the front of a buffer. */
export function parseFrames(buffer) {
  const messages = [];
  let rest = buffer;
  for (;;) {
    const end = rest.indexOf(SEPARATOR);
    if (end < 0) {
      break;
    }
    const match = /Content-Length: (\d+)/i.exec(rest.subarray(0, end));
    const start = end + SEPARATOR.length;
    const length = Number(match[1]);
    if (rest.length < start + length) {
      break;
    }
    messages.push(JSON.parse(rest.subarray(start, start + length)));
    rest = rest.subarray(start + length);
  }
  return { messages, rest };
}

export class LspProcess {
  constructor() {
    this.child = spawn(process.execPath, [BIN], { stdio: "pipe" });
    this.buffer = Buffer.alloc(0);
    this.pending = new Map();
    this.stderr = "";
    this.exited = new Promise((resolve) => {
      this.child.on("exit", (code, signal) => resolve({ code, signal }));
    });
    this.child.stdout.on("data", (chunk) => this.receive(chunk));
    this.child.stderr.on("data", (chunk) => {
      this.stderr += chunk;
    });
  }

  receive(chunk) {
    const { messages, rest } = parseFrames(Buffer.concat([this.buffer, chunk]));
    this.buffer = rest;
    for (const message of messages) {
      this.pending.get(message.id)?.(message);
      this.pending.delete(message.id);
    }
  }

  /**
   * Sends a request and resolves with the matching response. Rejects if
   * the server exits first, with its exit status and stderr, so a crash
   * is reported as such rather than as a test timeout.
   */
  request(id, method, params) {
    const response = new Promise((resolve) => this.pending.set(id, resolve));
    const crashed = this.exited.then(({ code, signal }) => {
      throw new Error(
        `server exited (code ${code}, signal ${signal}) before answering ` +
          `${method}; stderr: ${this.stderr}`,
      );
    });
    this.child.stdin.write(frame({ jsonrpc: "2.0", id, method, params }));
    return Promise.race([response, crashed]);
  }

  /** Sends a notification. */
  notify(method, params) {
    this.child.stdin.write(frame({ jsonrpc: "2.0", method, params }));
  }

  kill() {
    if (this.child.exitCode === null) {
      this.child.kill();
    }
  }
}
