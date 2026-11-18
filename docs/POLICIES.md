<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# Policies

## Minimum Node.js version

The floor is **Node.js 22** (`engines` in `package.json`), the same as
`@sebastienrousseau/jspassgen`, which this package depends on. CI tests
the floor and the current LTS line (22 and 24) on every push and pull
request.

The floor rises only when a Node.js line reaches end of life, or when
jspassgen raises its own floor, and only in a suite version whose
`CHANGELOG.md` section says so and why.

## Versions

`0.0.x`, moving by exactly `0.0.1`, in lockstep with every member of the
jspassgen suite
([ADR 0001](https://github.com/sebastienrousseau/jspassgen/blob/main/docs/adr/0001-ecosystem-lockstep.md)).
The `@sebastienrousseau/jspassgen` dependency is pinned to an exact
version.
