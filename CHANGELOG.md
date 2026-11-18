<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions
advance in `0.0.1` steps in lockstep with the jspassgen suite.

## [0.0.22] - Unreleased

The planned first release, in lockstep with the jspassgen suite. Nothing
is published yet.

### Added

- A stdio language server (`bin/jspassgen-lsp.js`, on
  `vscode-languageserver`) that completes the LSP handshake: it answers
  `initialize` with its name and version, `shutdown` with `null`, and
  exits on `exit` (status 0 after `shutdown`, 1 without it). It
  advertises no capabilities yet; the weak-secret diagnostics and the
  replace-with-generated code action are not built.
- `@sebastienrousseau/jspassgen` 0.0.20 as a run-time dependency, pinned
  exactly. The server does not call it yet.
- Tests that spawn the server and exchange the handshake over JSON-RPC,
  at 100% coverage; `examples/handshake.js` and the README demo rendered
  from it.
- The repository standard: `make check`, ESLint with the complexity
  ceilings, Prettier, CI, CodeQL, the DCO check, docs lint (markdownlint,
  codespell, REUSE, links), OpenSSF Scorecard and Dependabot, with every
  action pinned to a commit SHA.
