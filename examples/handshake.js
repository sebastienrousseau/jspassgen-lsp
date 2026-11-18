// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// Starts the server as an editor would (a child process on stdio), runs
// the LSP handshake and prints each message: initialize and its result,
// initialized, shutdown, exit, and the server's exit status. Nothing
// leaves the machine.
//
// Usage: node examples/handshake.js

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  createMessageConnection,
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-languageserver/node";

const bin = fileURLToPath(new URL("../bin/jspassgen-lsp.js", import.meta.url));
const server = spawn(process.execPath, [bin], { stdio: "pipe" });
const exited = new Promise((resolve) => server.on("exit", resolve));
const connection = createMessageConnection(
  new StreamMessageReader(server.stdout),
  new StreamMessageWriter(server.stdin),
);
connection.listen();

const show = (arrow, label, value) =>
  console.log(
    `${arrow} ${label}`,
    value === undefined ? "" : JSON.stringify(value),
  );

const params = { processId: process.pid, rootUri: null, capabilities: {} };
show("->", "initialize");
show("<-", "result", await connection.sendRequest("initialize", params));
show("->", "initialized");
await connection.sendNotification("initialized", {});
show("->", "shutdown");
show("<-", "result", await connection.sendRequest("shutdown"));
show("->", "exit");
await connection.sendNotification("exit");
show("  ", "server exit status", await exited);
connection.dispose();
