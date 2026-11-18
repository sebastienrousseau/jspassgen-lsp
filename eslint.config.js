// SPDX-License-Identifier: Apache-2.0 OR MIT
//
// ESLint flat config. The complexity ceilings are the portfolio's
// (~/Code/AGENTS.md section 0): cyclomatic 10, cognitive 15, 60 lines per
// function and 500 per file, on every JavaScript file in the repository,
// tests and scripts included. There is no baseline of offenders: every
// file is within the ceilings. Formatting is Prettier's (`npm run
// format:check`), so no stylistic rules here.

import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";

export default [
  {
    ignores: ["coverage/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    plugins: { sonarjs },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: { ...globals.node },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      complexity: ["error", 10],
      "sonarjs/cognitive-complexity": ["error", 15],
      "max-lines-per-function": [
        "error",
        { max: 60, skipBlankLines: false, skipComments: false },
      ],
      "max-lines": [
        "error",
        { max: 500, skipBlankLines: false, skipComments: false },
      ],
      curly: "error",
      eqeqeq: "error",
      "no-console": "error",
    },
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: { ...globals.mocha },
    },
  },
  {
    // Scripts and examples print their results.
    files: ["scripts/**/*.js", "examples/**/*.js"],
    rules: { "no-console": "off" },
  },
];
