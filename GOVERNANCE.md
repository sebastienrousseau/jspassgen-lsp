<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Governance

How jspassgen-lsp is run, who decides, and what happens if the
maintainer is unavailable.

## Scope

jspassgen-lsp is the language server of the jspassgen suite. It carries
no generation logic of its own: values and entropy come from
`@sebastienrousseau/jspassgen`. Changes are weighed against that, and
against keeping every secret on the user's machine: correctness, security
and clarity over feature breadth.

## Roles

| Role | Who | Responsibilities |
| :--- | :--- | :--- |
| **Maintainer** | Sebastien Rousseau (single maintainer) | Reviews and merges pull requests, cuts and signs releases, triages issues and security reports, sets direction, holds the repository's admin rights |
| **Contributor** | Anyone with a merged pull request | Proposes changes with tests, reviews others' pull requests |
| **User** | Everyone | Reports bugs, asks questions, requests features through issues |

## Decisions

- **Day-to-day changes** (fixes, tests, docs, additive features within
  scope) land on the release branch `feat/v<next-version>`; the
  maintainer merges its pull request once CI is green.
- **Significant changes** (a new dependency, a new rule category, a
  change to the version line) start as an issue and get an ADR.
- **The suite version** is decided for the whole jspassgen family
  ([ADR 0001](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)):
  this server moves in lockstep with jspassgen, one `0.0.1` step at a
  time.

Every change passes the CI gates (versions, lint and complexity,
formatting, tests at 100% coverage on Node.js 22 and 24, `npm audit`,
CodeQL, the DCO check, docs lint) before merge. At most one pull request
targets `main` at a time: the release branch.

## Releases

Releases follow the process in [DEVELOPMENT.md](DEVELOPMENT.md#release-model):
a signed annotated `v<version>` tag. Only the maintainer pushes tags.

## Access continuity

- **Code and history** are public on GitHub; anyone can fork and build
  from them. Every commit is signed.
- **No secret is needed to build or test.**
- **If the maintainer is unreachable** for 90 days, the project should
  be treated as unmaintained: users should pin a release, and a fork may
  continue it under a new name. Adding a second maintainer is a standing
  goal.

## Code of conduct

Everyone in the project follows [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
