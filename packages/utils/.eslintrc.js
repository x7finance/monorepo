/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ["@x7/eslint-config/base", "@x7/eslint-config/react"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
}

module.exports = config
