# SPDX-License-Identifier: Apache-2.0 OR MIT
#
# `make check` is the gate, and runs what the CI lint and test jobs run:
# the version restatements, ESLint (with the complexity ceilings),
# Prettier, the tests at 100% line, branch, function and statement
# coverage, and npm audit. It installs from package-lock.json first.

NPM ?= npm

.PHONY: check install versions lint format format-check test audit demo clean

check: install versions lint format-check test audit

install:
	$(NPM) ci --no-fund --no-audit

versions:
	node scripts/verify-versions.js

lint:
	$(NPM) run lint

format:
	$(NPM) run format

format-check:
	$(NPM) run format:check

test:
	$(NPM) test

audit:
	$(NPM) audit

# Render .github/demo.gif with vhs (it needs vhs, ttyd and ffmpeg).
demo:
	@command -v vhs >/dev/null 2>&1 || { echo "demo: vhs not found (https://github.com/charmbracelet/vhs)"; exit 1; }
	vhs .github/demo.tape

clean:
	rm -rf coverage node_modules
