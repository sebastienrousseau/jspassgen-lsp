<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Getting support

## Read first

- [README.md](README.md): what the server does today, what it will do,
  and how to run it.
- [The examples](examples/): runnable programs; the tests run every one.
- [DEVELOPMENT.md](DEVELOPMENT.md): setup, testing and every CI gate.

## Supported versions

Nothing is released yet; `0.0.22` is the planned first release, in
lockstep with the jspassgen suite. While pre-`1.0`, the latest released
`0.0.x` will be supported; older ones will not.

| Version | Status | Supported |
| :--- | :--- | :--- |
| `0.0.22` | Planned, unreleased | Not yet released |
| `main` | In development | Yes |

## Questions and bugs

Open an [issue](https://github.com/sebastienrousseau/jspassgen-lsp/issues/new/choose).
For a bug, include the commit, your Node.js version, your editor and its
LSP client, and a minimal reproducer. Use synthetic secrets only.

A behaviour that comes from password generation or entropy estimation
belongs in [jspassgen's issues](https://github.com/sebastienrousseau/jspassgen/issues).

## Security

Never report a vulnerability in a public issue; follow
[SECURITY.md](SECURITY.md).

## Response times

The project is maintained in a personal capacity, with no SLA. The goal
is a first answer within a few working days.
