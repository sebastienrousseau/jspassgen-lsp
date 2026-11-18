<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# AGENTS.md

`jspassgen-lsp` is the language server of the jspassgen suite
([ADR 0001](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)).
It will report weak or low-entropy literal secrets in configuration and
`.env` files, with a code action that replaces one with a value generated
by [`@sebastienrousseau/jspassgen`](https://github.com/sebastienrousseau/jspassgen).
Today it completes the LSP handshake over stdio and nothing more: the
diagnostics and the code action are not built yet. Its value is that an
editor flags a weak secret where it is written, using the same generator
and entropy rules as every other suite member, without the secret
leaving the machine. Read [CONTRIBUTING.md](CONTRIBUTING.md) and
[DEVELOPMENT.md](DEVELOPMENT.md) as well. The portfolio rules in
`~/Code/AGENTS.md` apply; where this file is more specific, it wins.

## Rules

- **Version.** `0.0.x`, moving by exactly `0.0.1`, in lockstep with the
  jspassgen suite; never propose a jump. The version lives once, in
  `package.json`; `package-lock.json`, `CITATION.cff` and the newest
  `CHANGELOG.md` heading restate it, and `make versions` fails when one
  disagrees. Work for the next version happens on `feat/v<next-version>`;
  every other branch, Dependabot's included, reaches that branch as
  commits, never as a pull request into `main`.
- **No generation logic here.** Generating a value and estimating its
  entropy belong to `@sebastienrousseau/jspassgen`, pinned to the exact
  suite version (no `^` or `~`). A rule that needs new generation
  behaviour is a change to jspassgen first.
- **Local only.** No network call, no telemetry, no update check. The
  server talks to its editor over stdio and nothing else.
- **Never log or expose a secret.** A literal the server inspects never
  appears in a log, an error message, a diagnostic message or
  `window/logMessage`; a diagnostic names the weakness, not the value.
- **Gates.** `make check` must pass: version restatements, ESLint with
  the complexity ceilings (cyclomatic 10, cognitive 15, 60 lines per
  function, 500 per file; no baseline, no offenders), Prettier, the tests
  at 100% line, branch, function and statement coverage, and `npm audit`
  with zero findings. No blanket suppressions; an advised transitive
  dependency is constrained in `overrides` so no affected version
  resolves.
- **Commits.** Conventional, header at most 50 characters, body wrapped
  at 72. Every commit carries the maintainer's `Signed-off-by:` from
  `git commit -s`, and only that one: an agent never adds a sign-off of
  its own. Agent work adds an `Assisted-by:` trailer. Commits are
  SSH-signed. Never rewrite pushed history; never merge into `main`
  without the maintainer.
- **Data.** Synthetic secrets only, in tests, fixtures and issues.

## The gate

```sh
make check
```

## Leave alone

`LICENSE-APACHE`, `LICENSE-MIT`, `LICENSES/`, `DCO.txt` and `KEYS.asc`,
unless the task is to update them. `package-lock.json` changes only with
a dependency change.
