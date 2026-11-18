// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// The version lives in package.json. This check fails when a file that
// restates it disagrees (package-lock.json, CITATION.cff, the newest
// CHANGELOG.md heading), or when a run-time dependency is not pinned to
// an exact version (the suite pins @sebastienrousseau/jspassgen exactly).
//
// Usage: node scripts/verify-versions.js

import { readFileSync } from "node:fs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const manifest = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));
const expected = manifest.version;

const restated = {
  "package-lock.json version": lock.version,
  'package-lock.json packages[""].version': lock.packages[""].version,
  "CITATION.cff version": /^version: "([^"]+)"$/m.exec(
    read("CITATION.cff"),
  )?.[1],
  "CHANGELOG.md newest heading": /^## \[([^\]]+)\]/m.exec(
    read("CHANGELOG.md"),
  )?.[1],
};

const problems = Object.entries(restated)
  .filter(([, value]) => value !== expected)
  .map(([where, value]) => `${where} is ${value}, package.json is ${expected}`);

for (const [name, range] of Object.entries(manifest.dependencies ?? {})) {
  if (!/^\d+\.\d+\.\d+$/.test(range)) {
    problems.push(`dependency ${name} is "${range}", not an exact version`);
  }
}

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`verify-versions: ${problem}`);
  }
  process.exit(1);
}
console.log(`verify-versions: every restatement is ${expected}`);
