<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Security Policy

## Supported versions

This package follows the [jspassgen](https://github.com/sebastienrousseau/jspassgen)
suite cadence. The latest release is `0.0.22`, the first. While
pre-`1.0`, the latest released `0.0.x` receives security fixes; older
`0.0.x` versions do not.

| Version | Status | Receives security fixes? |
| :--- | :--- | :--- |
| `0.0.22` | Latest release | Yes |
| `main` | In development | Yes |

## Reporting a vulnerability

**Do not open a public issue for security reports.**

Use GitHub Private Vulnerability Reporting:
<https://github.com/sebastienrousseau/jspassgen-lsp/security/advisories/new>.
A vulnerability in password generation or entropy estimation belongs in
[jspassgen's advisories](https://github.com/sebastienrousseau/jspassgen/security/advisories/new).

Please include a description and its impact, a minimal reproducer
(preferably a failing test), the commit or version affected, and any
proposed fix. Use synthetic secrets only.

These are goals, not guarantees: the project is maintained in a personal
capacity, with no SLA. **Acknowledgement**: the goal is within 5 working
days. **Triage**: a severity assessment and remediation plan after
acknowledgement.

## Security posture

### Scope

The server is a local process that an editor starts and talks to over
stdio (JSON-RPC). Today it answers the LSP handshake only. It opens no
network connection, sends no telemetry and writes no files.

### Threat model

| Surface | How it is handled |
| :--- | :--- |
| **Secrets in messages and logs** | The planned diagnostics name a weakness, never the value; no secret goes to a log, an error or `window/logMessage` (AGENTS.md). |
| **Network** | None. The only transport is the editor's stdio. |
| **Generated values** | Come from `@sebastienrousseau/jspassgen` on the platform CSPRNG, pinned to an exact version; this package has no generator of its own. |
| **Dependencies** | `package-lock.json` is committed and installed with `npm ci`; `.npmrc` disables dependency install scripts. |

### Dependency audit

`npm audit` runs in `make check` and on every push and pull request in
CI, and must report zero findings; an advised transitive dependency is
constrained in `package.json` `overrides`. Dependabot proposes weekly
updates of the npm dependencies and of the pinned workflow actions.
