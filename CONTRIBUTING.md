<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Contributing

Thanks for looking. This package is the jspassgen suite's language
server. Generation and entropy rules belong in
[`jspassgen`](https://github.com/sebastienrousseau/jspassgen); a change
here should make the server more correct, safer or easier to use from an
editor.

## Before you open a pull request

Everything CI checks, you can run locally (`mise install` provides
Node.js):

```sh
make check            # versions, ESLint and complexity, Prettier, tests at 100% coverage, npm audit
```

`make format` rewrites the JavaScript, JSON and YAML with Prettier.

## The README demo

`make demo` renders `.github/demo.gif` from `.github/demo.tape` with
[VHS](https://github.com/charmbracelet/vhs) (it needs `vhs`, `ttyd` and
`ffmpeg`). It runs `examples/handshake.js` against the local server.
Re-render the GIF in the same change as anything that alters what it
shows.

## Rules

- **No generation logic.** Values and entropy come from
  `@sebastienrousseau/jspassgen`, pinned to an exact version.
- **Local only.** No network call and no telemetry.
- **Never log or expose a secret** the server inspects, in any message
  it sends or any error it raises.
- **Complexity ceilings.** Every function stays within cyclomatic 10,
  cognitive 15 and 60 lines, and every file within 500 lines
  (`npm run lint`).
- **100% coverage.** `npm test` fails below 100% of lines, branches,
  functions and statements in `src/` and `bin/`; add the test with the
  code.
- **No suppressions.** Fix the cause rather than adding an
  `eslint-disable`; a justified exception is a specific inline rule with
  a reason.
- **Synthetic secrets only** in tests, fixtures and issues.

## Commits

Conventional commits (`feat:`, `fix:`, `docs:`, `ci:`, `test:`,
`chore:`), an imperative subject of at most 50 characters, and a body
wrapped at 72 characters that explains what and why. Every commit
carries a `Signed-off-by:` trailer (`git commit -s`), which certifies
the [DCO](DCO.txt), and is signed.

## Versioning

The version lives in `package.json` and is restated in
`package-lock.json`, `CITATION.cff` and the newest `CHANGELOG.md`
heading; `make versions` checks them. **Versions increment by 0.0.1**, in
lockstep with the jspassgen suite. [DEVELOPMENT.md](DEVELOPMENT.md)
describes the release model.

## Licence

Apache-2.0 OR MIT, at your option. By contributing you agree your work is
released under the same dual grant.
