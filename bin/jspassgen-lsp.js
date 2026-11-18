#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// Entry point: the language server over stdio (JSON-RPC with
// Content-Length framing on stdin and stdout).

import {
  createConnection,
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-languageserver/node";
import { attach } from "../src/server.js";

attach(
  createConnection(
    new StreamMessageReader(process.stdin),
    new StreamMessageWriter(process.stdout),
  ),
).listen();
