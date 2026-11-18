// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// The LSP handshake over stdio, against the real server process:
// initialize, initialized, shutdown and exit.

import { readFileSync } from "node:fs";
import { expect } from "chai";
import { LspProcess } from "./support/lsp-process.js";

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const INITIALIZE_PARAMS = {
  processId: null,
  rootUri: null,
  capabilities: {},
  clientInfo: { name: "jspassgen-lsp-tests" },
};

describe("jspassgen-lsp over stdio", () => {
  let server;

  beforeEach(() => {
    server = new LspProcess();
  });

  afterEach(() => {
    server.kill();
  });

  it("answers initialize with its name and the package version", async () => {
    const response = await server.request(1, "initialize", INITIALIZE_PARAMS);

    expect(response.jsonrpc).to.equal("2.0");
    expect(response.id).to.equal(1);
    expect(response).to.not.have.property("error");
    expect(response.result.serverInfo).to.deep.equal({
      name: "jspassgen-lsp",
      version: manifest.version,
    });
    expect(response.result.capabilities).to.be.an("object");
  });

  it("answers shutdown with null and exits with status 0", async () => {
    await server.request(1, "initialize", INITIALIZE_PARAMS);
    server.notify("initialized", {});

    const response = await server.request(2, "shutdown");
    expect(response).to.deep.equal({ jsonrpc: "2.0", id: 2, result: null });

    server.notify("exit");
    expect(await server.exited).to.deep.equal({ code: 0, signal: null });
    expect(server.stderr).to.equal("");
  });

  it("exits with status 1 on exit without shutdown", async () => {
    await server.request(1, "initialize", INITIALIZE_PARAMS);

    server.notify("exit");
    expect(await server.exited).to.deep.equal({ code: 1, signal: null });
  });
});
