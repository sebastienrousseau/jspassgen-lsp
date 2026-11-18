<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

<p align="center">
  <img src="https://raw.githubusercontent.com/sebastienrousseau/jspassgen/main/.github/assets/logo.svg" alt="jspassgen logo" width="128" />
</p>

<h1 align="center">jspassgen-lsp</h1>

<p align="center">
  The jspassgen suite's language server: it will flag weak literal secrets in configuration and .env files and replace them with locally generated values. Today it completes the LSP handshake only.
</p>

<p align="center">
  <a href="https://github.com/sebastienrousseau/jspassgen-lsp/actions"><img src="https://img.shields.io/github/actions/workflow/status/sebastienrousseau/jspassgen-lsp/ci.yml?style=for-the-badge&logo=github" alt="Build" height="28" /></a>
  <a href="https://www.npmjs.com/package/@sebastienrousseau/jspassgen-lsp"><img src="https://img.shields.io/npm/v/@sebastienrousseau%2Fjspassgen-lsp?style=for-the-badge&color=fc8d62&logo=npm" alt="npm (not published yet)" height="28" /></a>
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

- [Install](#install): from source; not on npm yet
- [Requirements](#requirements): Node.js floor, platforms, an LSP client
- [Quick Start](#quick-start): run the handshake against the server

**The jspassgen ecosystem**

- [The jspassgen ecosystem](#the-jspassgen-ecosystem): the core library and the suite members around it

**Library reference**

- [Capabilities at a glance](#capabilities-at-a-glance): what is built and what is planned
- [Ecosystem comparison](#ecosystem-comparison): not yet, and why
- [Benchmarks](#benchmarks): not yet, and why
- [Features](#features): the current surface
- [Configuration](#configuration): none yet
- [Examples](#examples): runnable example index

**Operational**

- [When not to use jspassgen-lsp](#when-not-to-use-jspassgen-lsp): limitations
- [Development](#development): make targets, tests, CI
- [Security](#security): posture and reporting
- [Documentation](#documentation): all reference docs
- [Stability guarantees](#stability-guarantees): version axis, toolchain discipline
- [License](#license)

---

## Install

### As a Node.js library

The package `@sebastienrousseau/jspassgen-lsp` is **not on npm yet**; it
is planned for the jspassgen suite's first lockstep release, 0.0.22.
Until then, run it from a clone:

```sh
git clone https://github.com/sebastienrousseau/jspassgen-lsp.git
cd jspassgen-lsp
npm ci
node bin/jspassgen-lsp.js    # the server, on stdio
```

The run-time dependencies are `vscode-languageserver` and
`@sebastienrousseau/jspassgen`, both pinned to exact versions.

---

## Requirements

- **Node.js 22 or newer** (`engines` in `package.json`); CI tests Node.js
  22 and 24 on Linux. The policy for raising the floor is in
  [`docs/POLICIES.md`](docs/POLICIES.md).
- **An editor with an LSP client** that starts a server as a child
  process and speaks JSON-RPC over its stdin and stdout. No editor
  integration is packaged or tested yet.
- No network access at run time.

---

## Quick Start

```sh
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

jspassgen is one password and passphrase core with tools and native
ports around it, all released at the same version
([ADR 0001](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)).
The full member list, with each one's status, is
[`docs/ecosystem.json`](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/ecosystem.json)
in jspassgen.

| Component | Purpose | Use case |
| :--- | :--- | :--- |
| [jspassgen](https://github.com/sebastienrousseau/jspassgen) | Zero-dependency password and passphrase core, Node.js library, web UI and workers | Generate a secret on the user's machine from the platform CSPRNG |
| **jspassgen-lsp** (planned) | Language server for weak literal secrets in configuration and `.env` files | See a weak secret flagged in the editor and replace it with a generated one |

---

## Capabilities at a glance

| Area | Capability | Status |
| :--- | :--- | :--- |
| Protocol | LSP handshake over stdio: `initialize` with server info, `shutdown`, `exit` | Implemented |
| Diagnostics | Weak or low-entropy literal secrets in configuration and `.env` files | Planned, not built |
| Code actions | Replace a flagged secret with a value generated by jspassgen | Planned, not built |

---

## Ecosystem comparison

Not applicable yet: the server has no diagnostics, so there is nothing to
compare with other secret linters. A comparison, with its evidence, comes
with the first diagnostic rules.

---

## Benchmarks

Not applicable yet: the server only answers the handshake. Benchmarks
come with the diagnostics, measured on real configuration files.

---

## Features

- A stdio language server built on `vscode-languageserver`.
- `initialize` returns `serverInfo` with the name `jspassgen-lsp` and the
  version from `package.json`.
- `shutdown` returns `null`; `exit` ends the process with status 0 after
  `shutdown` and 1 without it, as the LSP specification requires.
- No network, no telemetry, no files written.

---

## Configuration

None yet. The server reads no settings and no environment variables.
Rule settings arrive with the diagnostics.

---

## Examples

| Example | What it shows |
| :--- | :--- |
| [`examples/handshake.js`](examples/handshake.js) | Starts the server on stdio, runs `initialize`, `initialized`, `shutdown` and `exit`, and prints each message and the exit status |

`npm test` runs every example.

---

## When not to use jspassgen-lsp

- **Today, for anything but trying the handshake.** It reports nothing
  yet.
- **To find secrets in git history or CI logs.** It will look at the
  files open in your editor, not at history; use a repository secret
  scanner for that.
- **To decide whether a real credential leaked.** A strong value that was
  committed is still leaked; rotating it is outside what a linter can do.
- **To generate passwords on their own.** Use
  [jspassgen](https://github.com/sebastienrousseau/jspassgen) directly.

---

## Development

```bash
mise install    # Node.js (mise.toml)
make check      # versions, ESLint and complexity, Prettier, tests at 100% coverage, npm audit
make demo       # re-render .github/demo.gif (needs vhs)
```

[DEVELOPMENT.md](DEVELOPMENT.md) maps every CI job to its local command.
[CONTRIBUTING.md](CONTRIBUTING.md) has the rules for a pull request.

---

## Security

The server is a local process an editor talks to over stdio. It opens no
network connection, sends no telemetry and writes no files. When the
diagnostics land, a diagnostic will name the weakness, never the secret.
Dependencies are locked in `package-lock.json`, installed with `npm ci`,
and audited with `npm audit` on every push; workflow actions are pinned
to commit SHAs, and CodeQL and OpenSSF Scorecard run on the repository.

Report vulnerabilities according to [`SECURITY.md`](SECURITY.md).

---

## Documentation

- **User manual**: not yet; this README is the manual until the
  diagnostics land.
- **API reference**: not yet; the package's public surface is the
  `jspassgen-lsp` executable.
- **Developer docs**: [DEVELOPMENT.md](DEVELOPMENT.md),
  [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md).
- **Ecosystem map**:
  [ADR 0001](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)
  and
  [`docs/ecosystem.json`](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/ecosystem.json).
- **Policies**: [`docs/POLICIES.md`](docs/POLICIES.md),
  [SECURITY.md](SECURITY.md), [SUPPORT.md](SUPPORT.md),
  [GOVERNANCE.md](GOVERNANCE.md), [CHANGELOG.md](CHANGELOG.md).

---

## Stability guarantees

- **Version axis.** `0.0.x`, moving by `0.0.1` in lockstep with the
  jspassgen suite. Before `1.0` any release may change behaviour; each
  change is recorded in [CHANGELOG.md](CHANGELOG.md).
- **Output stability.** Once diagnostics ship, a change to which input
  is flagged, or to a diagnostic's code, counts as a behaviour change and
  is called out in the changelog even when no API moves.
- **Minimum toolchain.** Node.js 22; raised only as
  [`docs/POLICIES.md`](docs/POLICIES.md) describes.

---

## License

Dual-licensed under [Apache-2.0](LICENSE-APACHE) or [MIT](LICENSE-MIT),
at your option.
