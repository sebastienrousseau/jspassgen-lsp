<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions
advance in `0.0.1` steps in lockstep with the jspassgen suite.

## [0.0.24] - 2026-11-21

### Added

- Releases carry their SLSA build provenance. The release workflow
  attests every release file with `actions/attest-build-provenance`,
  signed through Sigstore and stored as a GitHub attestation, and
  attaches the bundle, listed in the release checksums, as
  `jspassgen-lsp-<version>.intoto.jsonl`. Check a download with
  `gh attestation verify <file> --repo sebastienrousseau/jspassgen-lsp`.
  This answers the OpenSSF Scorecard Signed-Releases check.

### Changed

- Requires `@sebastienrousseau/jspassgen` 0.0.24, pinned exactly, the
  suite's third lockstep release.

## [0.0.23] - 2026-11-20

In lockstep with the jspassgen suite's 0.0.23. The server's behaviour
is unchanged: it still completes the LSP handshake only.

### Added

- Property-based tests with fast-check 4.10.2 (pinned exactly, as in
  jspassgen and the CLI), in `test/server.property.test.js`. They drive
  the server's handlers in process with generated JSON-RPC traffic cut
  into arbitrary chunks: any `initialize` gets one answer with its id
  and the server info, a synthetic secret in the params never appears
  in what the server writes, an unknown method is refused with
  MethodNotFound without ending the session, and an `initialize` result
  cannot be mutated into the next. OpenSSF Scorecard's Fuzzing check
  detects the fast-check import.
- `.github/CODEOWNERS`, naming the maintainer as the owner of every
  file.

### Changed

- `SECURITY.md` and `SUPPORT.md` name 0.0.23 as the supported release.
- The README demo is re-rendered for the new version.
- The run-time dependency `@sebastienrousseau/jspassgen` moves to
  0.0.23, still pinned exactly. The server does not call it yet.

## [0.0.22] - 2026-11-18

The first release, in lockstep with the jspassgen suite.

### Added

- A stdio language server (`bin/jspassgen-lsp.js`, on
  `vscode-languageserver`) that completes the LSP handshake: it answers
  `initialize` with its name and version, `shutdown` with `null`, and
  exits on `exit` (status 0 after `shutdown`, 1 without it). It
  advertises no capabilities yet; the weak-secret diagnostics and the
  replace-with-generated code action are not built.
- `@sebastienrousseau/jspassgen` 0.0.22 as a run-time dependency, pinned
  exactly. The server does not call it yet.
- Tests that spawn the server and exchange the handshake over JSON-RPC,
  at 100% coverage; `examples/handshake.js` and the README demo rendered
  from it.
- The repository standard: `make check`, ESLint with the complexity
  ceilings, Prettier, CI, CodeQL, the DCO check, docs lint (markdownlint,
  codespell, REUSE, links), OpenSSF Scorecard and Dependabot, with every
  action pinned to a commit SHA.
