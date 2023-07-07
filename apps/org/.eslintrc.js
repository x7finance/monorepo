/* eslint-disable @typescript-eslint/no-var-requires */
require("@wayofdev/eslint-config-bases/patch/modern-module-resolution")

const {
  getDefaultIgnorePatterns,
} = require("@wayofdev/eslint-config-bases/helpers")

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
  },
  ignorePatterns: [...getDefaultIgnorePatterns(), ".next", ".out"],
  extends: [
    "@x7/eslint-config/base",
    "@x7/eslint-config/nextjs",
    "@x7/eslint-config/react",
  ],
  rules: {
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react-hooks/exhaustive-deps": "off",
  },
}

module.exports = config
