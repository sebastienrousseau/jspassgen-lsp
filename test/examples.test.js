// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// Every example runs and prints what the README says it prints.

import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { expect } from "chai";

const run = promisify(execFile);
const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

describe("examples", () => {
  it("handshake.js completes the handshake and the server exits 0", async () => {
    const example = fileURLToPath(
      new URL("../examples/handshake.js", import.meta.url),
    );
    const { stdout } = await run(process.execPath, [example]);

    expect(stdout).to.include(
      `"serverInfo":{"name":"jspassgen-lsp","version":"${manifest.version}"}`,
    );
    expect(stdout).to.include("<- result null");
    expect(stdout).to.match(/server exit status 0$/m);
  });
});
