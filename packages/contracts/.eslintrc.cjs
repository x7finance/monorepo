/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ["@x7/eslint-config/base"],
  parserOptions: {
    project: "./tsconfig.json",
  },
}

module.exports = config
