const { concatFilesForPrettier } = require("@wayofdev/lint-staged-config")

const json = require("@wayofdev/lint-staged-config/json")
const md = require("@wayofdev/lint-staged-config/md")

const rules = {
  ...json,
  ...md,
  "**/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts}": (filenames) => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`]
  },
}

module.exports = rules
