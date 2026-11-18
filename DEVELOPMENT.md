<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Development

## Setup

```sh
mise install          # Node.js 24 (mise.toml); the floor is 22
npm ci                # the locked dependencies from package-lock.json
```

The package is plain ESM JavaScript on Node.js, with no build step.
`package-lock.json` is committed and CI installs with `npm ci`.

## Layout

| Path | What it holds |
| :--- | :--- |
| `bin/jspassgen-lsp.js` | The executable: a `vscode-languageserver` connection on stdin and stdout |
| `src/server.js` | The server's handlers and its name and version, independent of the transport |
| `test/` | Mocha tests; `test/support/lsp-process.js` spawns the server and speaks framed JSON-RPC to it |
| `examples/` | Runnable examples; the tests run every one |
| `scripts/` | `verify-versions.js` (version restatements), `readme-check.sh` (README template) |

## CI gates and their local commands

| CI job | What it checks | Local command |
| :--- | :--- | :--- |
| `ci.yml` lint | Version restatements, ESLint with the complexity ceilings, Prettier, `npm audit` | `make install versions lint format-check audit` |
| `ci.yml` test (Node.js 22 and 24) | The tests at 100% coverage | `make test` |
| `ci.yml` package | The files `npm pack` would publish | `npm pack --dry-run` |
| `codeql.yml` | CodeQL for JavaScript and for the workflows | (GitHub only) |
| `docs-lint.yml` | markdownlint, the README template, codespell, REUSE, links | `scripts/readme-check.sh` and the tools named in the workflow |
| `dco.yml` | `Signed-off-by:` on every commit | `git log --format=%B` |
| `scorecard.yml` | OpenSSF Scorecard | (GitHub only) |

`make check` runs the lint and test jobs' commands in one go.

## Tests and coverage

`npm test` runs Mocha under c8. The handshake tests spawn
`bin/jspassgen-lsp.js` as a child process; c8 follows it through
`NODE_V8_COVERAGE`, so the executable is covered too. The gate is 100%
of lines, branches, functions and statements in `src/` and `bin/`.

## Complexity

ESLint enforces the ceilings on every JavaScript file, tests and scripts
included: `complexity` (cyclomatic) 10, `sonarjs/cognitive-complexity`
15, `max-lines-per-function` 60 and `max-lines` 500. There is no
baseline: no file is over a ceiling. Halstead difficulty is not measured
yet; ESLint has no rule for it.

## Release model

There is no release workflow yet; it arrives with the first suite
release. The intended model, as in the other suite members:

1. On `feat/v<version>`: move the version in `package.json` and its
   restatements, date the `CHANGELOG.md` heading, and remove
   `"private": true` for the first publication.
2. Merge the release pull request into `main` once CI is green.
3. Tag `main` with a signed annotated tag:
   `git tag -s v<version> -m "jspassgen-lsp v<version>"`, and push it.
4. A release workflow checks the tag, runs the gate, packs the tarball,
   writes `SHA256SUMS`, creates the GitHub release titled
   `jspassgen-lsp <version>`, and publishes to npm with trusted
   publishing.
