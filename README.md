<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

<p align="center">
  <img src="https://raw.githubusercontent.com/sebastienrousseau/jspassgen/main/.github/assets/logo.svg" alt="jspassgen logo" width="128" />
</p>

<h1 align="center">jspassgen-lsp</h1>

<p align="center">
  A language server for the jspassgen suite that completes the LSP handshake over stdio today, and is planned to flag weak literal secrets in configuration and .env files.
</p>

<p align="center">
  <a href="https://github.com/sebastienrousseau/jspassgen-lsp/actions"><img src="https://img.shields.io/github/actions/workflow/status/sebastienrousseau/jspassgen-lsp/ci.yml?style=for-the-badge&logo=github" alt="Build" height="28" /></a>
  <a href="https://www.npmjs.com/package/@sebastienrousseau/jspassgen-lsp"><img src="https://img.shields.io/badge/npm-not%20published%20yet-lightgrey?style=for-the-badge&color=fc8d62&logo=npm" alt="npm: not published yet" height="28" /></a>
  <a href="https://github.com/sebastienrousseau/jspassgen-lsp/tree/main/docs"><img src="https://img.shields.io/badge/docs-repository-blue?style=for-the-badge&labelColor=555555&logo=readthedocs" alt="Docs" height="28" /></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/sebastienrousseau/jspassgen-lsp"><img src="https://img.shields.io/ossf-scorecard/github.com/sebastienrousseau/jspassgen-lsp?style=for-the-badge&label=OpenSSF%20Scorecard&logo=openssf" alt="OpenSSF Scorecard" height="28" /></a>
  <a href="LICENSE-APACHE"><img src="https://img.shields.io/badge/license-Apache--2.0%20OR%20MIT-blue.svg?style=for-the-badge" alt="License: Apache-2.0 OR MIT" height="28" /></a>
  <a href="https://github.com/sebastienrousseau/jspassgen-lsp/blob/main/docs/POLICIES.md"><img src="https://img.shields.io/badge/Node.js-22%2B-93450a.svg?style=for-the-badge&logo=node.js" alt="Node.js 22 or newer" height="28" /></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/sebastienrousseau/jspassgen-lsp/main/.github/demo.gif" alt="node examples/handshake.js: the example starts the server on stdio, sends initialize and receives the server info jspassgen-lsp 0.0.22, then sends initialized, shutdown (result null) and exit, and the server exits with status 0" width="100%" />
</p>

---

## Contents

**Getting started**

- [Install](#install): from a checkout; not on npm yet
- [Requirements](#requirements): Node.js floor, platforms, an LSP client
- [Quick Start](#quick-start): run the handshake against the server

**The jspassgen ecosystem**

- [The jspassgen ecosystem](#the-jspassgen-ecosystem): the core library, its tools and native SDKs, released in lockstep

**Library reference**

- [Capabilities at a glance](#capabilities-at-a-glance): what is built and what is planned
- [Ecosystem comparison](#ecosystem-comparison): not yet, and why
- [Benchmarks](#benchmarks): none published yet, and why
- [Features](#features): the current surface
- [Configuration](#configuration): none yet
- [Examples](#examples): runnable example index

**Operational**

- [When not to use jspassgen-lsp](#when-not-to-use-jspassgen-lsp): limitations
- [Development](#development): make targets, tests, CI
- [Security](#security): posture and reporting
- [Documentation](#documentation): all reference docs
- [Stability guarantees](#stability-guarantees): version axis, output stability, minimum toolchain discipline
- [License](#license)

---

## Development version

This branch prepares unreleased v0.0.22. It is not on npm yet
(`package.json` is marked `private`); run it from a checkout until the
suite's first lockstep release ships it.

---

## Install

### As a JavaScript library

The package is mainly the `jspassgen-lsp` executable, a server an editor
starts. Its module entry point, `src/server.js`, exports `attach`,
`initializeResult` and `SERVER_INFO` for wiring the server onto your own
`vscode-languageserver` connection. Until it is on npm, run it from a
clone:

```bash
git clone https://github.com/sebastienrousseau/jspassgen-lsp.git
cd jspassgen-lsp
npm ci
node bin/jspassgen-lsp.js    # the server, on stdio
```

The run-time dependencies are `vscode-languageserver` 11.0.0 and
`@sebastienrousseau/jspassgen` 0.0.20, both pinned to exact versions.
The server does not call jspassgen yet.

---

## Requirements

- Node.js 22 or newer (`engines` in `package.json`). CI tests Node.js 22
  and 24 on Ubuntu 24.04. The policy for raising the floor is in
  [`docs/POLICIES.md`](docs/POLICIES.md).
- An editor with an LSP client that starts a server as a child process
  and speaks JSON-RPC over its stdin and stdout. No editor integration is
  packaged or tested yet.
- No network access at run time.

---

## Quick Start

```bash
node examples/handshake.js
```

```text
-> initialize
<- result {"capabilities":{"textDocumentSync":0},"serverInfo":{"name":"jspassgen-lsp","version":"0.0.22"}}
-> initialized
-> shutdown
<- result null
-> exit
   server exit status 0
```

The example starts `bin/jspassgen-lsp.js` the way an editor does, runs
the LSP handshake and prints each message. The server reports its name
and version, advertises no capabilities yet (`textDocumentSync: 0` is
"none"), and exits with status 0 after `shutdown` and `exit`.

---

## The jspassgen ecosystem

jspassgen is one core library and the tools, SDKs and site around it.
Every member is listed in
[`docs/ecosystem.json`](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/ecosystem.json)
and, from the suite's first lockstep release, every member ships the same
version ([ADR 0001](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)).
The JavaScript tools depend on the core and add no generation logic of
their own; each SDK is a native port that is checked against the core's
conformance kit as its generators land.

| Component | Purpose | Use case |
| :--- | :--- | :--- |
| [`jspassgen`](https://github.com/sebastienrousseau/jspassgen) | Password and passphrase core, Node.js library, CLI, web UI and workers; source of the conformance kit | Programs that generate secrets |
| [`jspassgen-cli`](https://github.com/sebastienrousseau/jspassgen-cli) | Command-line generator built on the core | Passwords in a terminal or a script |
| [`jspassgen-mcp`](https://github.com/sebastienrousseau/jspassgen-mcp) | Local stdio MCP server | AI agents that need a generated secret |
| **`jspassgen-lsp`** | Language server for weak literal secrets | Editors checking configuration and `.env` files |
| [`jspassgen-sdk-python`](https://github.com/sebastienrousseau/jspassgen-sdk-python) | Native port on the `secrets` module | Python programs |
| [`jspassgen-sdk-rust`](https://github.com/sebastienrousseau/jspassgen-sdk-rust) | Native port on the OS CSPRNG | Rust programs |
| [`jspassgen-sdk-java`](https://github.com/sebastienrousseau/jspassgen-sdk-java) | Native port on `SecureRandom` | JVM programs |
| [`jspassgen-sdk-dotnet`](https://github.com/sebastienrousseau/jspassgen-sdk-dotnet) | Native port on `RandomNumberGenerator` | .NET programs |
| [`jspassgen-sdk-cpp`](https://github.com/sebastienrousseau/jspassgen-sdk-cpp) | Native C++17 port on the OS CSPRNG | C++ programs |
| [`jspassgen.github.io`](https://github.com/sebastienrousseau/jspassgen.github.io) | Source of [jspassgen.com](https://jspassgen.com) | Evaluating the suite |

Only `@sebastienrousseau/jspassgen` is on a package registry so far
(0.0.21 on npm). The table gives each member's purpose; the other members
are early, each README's Capabilities at a glance says what works today,
and they first publish with the suite's first lockstep release.

---

## Capabilities at a glance

| Area | Capability | Status |
| :--- | :--- | :--- |
| Protocol | LSP handshake over stdio: `initialize` with server info, `shutdown`, `exit` | Implemented |
| Diagnostics | Weak or low-entropy literal secrets in configuration and `.env` files | Planned, not built |
| Code actions | Replace a flagged secret with a value generated by jspassgen | Planned, not built |

---

## Ecosystem comparison

Not applicable yet. The server has no diagnostics, so there is nothing to
compare with other secret linters. A comparison, with its evidence, comes
with the first diagnostic rules.

---

## Benchmarks

None are published yet. The server only answers the handshake, and the
repository has no benchmark suite. Benchmarks come with the diagnostics,
measured on real configuration files.

---

## Features

- A stdio language server built on `vscode-languageserver`.
- `initialize` returns `serverInfo` with the name `jspassgen-lsp` and the
  version from `package.json`, and registers no diagnostics, code actions
  or document sync.
- `shutdown` returns `null`; `exit` ends the process with status 0 after
  `shutdown` and 1 without it, as the LSP specification requires.
- No file types are handled yet; the server reads no open documents.
- No network, no telemetry, no files written.

---

## Configuration

None yet. The server reads no settings, no workspace configuration and
no environment variables. Rule settings arrive with the diagnostics.

---

## Examples

| Example | What it shows |
| :--- | :--- |
| [`examples/handshake.js`](examples/handshake.js) | Starts the server on stdio, runs `initialize`, `initialized`, `shutdown` and `exit`, and prints each message and the exit status |

`npm test` runs every example and checks its output.

---

## When not to use jspassgen-lsp

- Do not use it today for anything but trying the handshake. It reports
  nothing yet.
- Do not use it to find secrets in git history or CI logs. It is planned
  to look at the files open in your editor, not at history; use a
  repository secret scanner for that.
- Do not use it to decide whether a real credential leaked. A strong
  value that was committed is still leaked, and rotating it is outside
  what a linter can do.
- Do not use it to generate passwords on their own. Use
  [jspassgen](https://github.com/sebastienrousseau/jspassgen) directly.

---

## Development

```bash
mise install    # Node.js (mise.toml)
make check      # versions, ESLint and complexity, Prettier, tests at 100% coverage, npm audit
make demo       # re-render .github/demo.gif (needs vhs, ttyd and ffmpeg)
```

[DEVELOPMENT.md](DEVELOPMENT.md) maps every CI job to its local command.
[CONTRIBUTING.md](CONTRIBUTING.md) has the rules for a pull request.

---

## Security

The server is a local process an editor talks to over stdio. It opens no
network connection, sends no telemetry and writes no files. The planned
diagnostics will name the weakness, never the secret. Dependencies are
locked in `package-lock.json`, installed with `npm ci`, and audited with
`npm audit` on every push and pull request. Workflow actions are pinned
to commit SHAs, and CodeQL and OpenSSF Scorecard run on the repository.

Report vulnerabilities according to [`SECURITY.md`](SECURITY.md).

---

## Documentation

- [Developer documentation](DEVELOPMENT.md)
- [Contributing](CONTRIBUTING.md)
- [Agent guidelines](AGENTS.md)
- [Engineering policies](docs/POLICIES.md)
- [Security policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Governance](GOVERNANCE.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)
- [Ecosystem map](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/ecosystem.json)
- [ADR 0001: ecosystem lockstep](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)

---

## Stability guarantees

- The version is `0.0.x`, moving by `0.0.1` in lockstep with the
  jspassgen suite. Before `1.0` any release may change behaviour, and
  each change is recorded in [CHANGELOG.md](CHANGELOG.md).
- Once diagnostics ship, a change to which input is flagged, or to a
  diagnostic's code, counts as a behaviour change and is called out in
  the changelog even when no API moves.
- The minimum toolchain is Node.js 22, raised only as
  [`docs/POLICIES.md`](docs/POLICIES.md) describes.

---

## License

Licensed under either [Apache License 2.0](LICENSE-APACHE) or
[MIT](LICENSE-MIT), at your option.
