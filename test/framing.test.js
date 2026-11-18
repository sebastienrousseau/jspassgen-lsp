// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// The test client's own framing, so a handshake failure points at the
// server rather than at the helper.

import { expect } from "chai";
import { frame, parseFrames } from "./support/lsp-process.js";

describe("test client framing", () => {
  it("round-trips messages and keeps an incomplete frame", () => {
    const first = { jsonrpc: "2.0", id: 1, result: "é" };
    const second = { jsonrpc: "2.0", id: 2, result: null };
    const whole = Buffer.concat([frame(first), frame(second)]);

    const { messages, rest } = parseFrames(whole.subarray(0, whole.length - 3));

    expect(messages).to.deep.equal([first]);
    expect(
      parseFrames(Buffer.concat([rest, whole.subarray(-3)])),
    ).to.deep.equal({ messages: [second], rest: Buffer.alloc(0) });
  });

  it("waits for a header that has not arrived", () => {
    const partial = Buffer.from("Content-Length: 10\r\n");
    expect(parseFrames(partial)).to.deep.equal({
      messages: [],
      rest: partial,
    });
  });
});
