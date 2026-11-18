// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// The language server's behaviour, independent of its transport. Today it
// only completes the LSP handshake and names itself; the weak-secret
// diagnostics and the replace-with-generated code action are not built
// yet. The server opens no network connection and sends no telemetry.

import { readFileSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

/**
 * The name and version the server reports in `initialize`, read from
 * package.json so the version lives in one place. The name is the
 * package name without its npm scope.
 */
export const SERVER_INFO = Object.freeze({
  name: manifest.name.split("/").pop(),
  version: manifest.version,
});

/**
 * The `initialize` result: no capabilities yet, and the server info.
 *
 * @returns {{capabilities: object, serverInfo: {name: string, version: string}}}
 */
export function initializeResult() {
  return { capabilities: {}, serverInfo: { ...SERVER_INFO } };
}

/**
 * Registers the server's handlers on a vscode-languageserver connection.
 * Shutdown and exit are handled by the connection itself: `exit` ends the
 * process with status 0 after `shutdown`, 1 without it.
 *
 * @param {import("vscode-languageserver").Connection} connection
 * @returns {import("vscode-languageserver").Connection} the same connection
 */
export function attach(connection) {
  connection.onInitialize(() => initializeResult());
  return connection;
}
