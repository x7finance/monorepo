module.exports = {
  root: true,
  extends: ["next", "turbo", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
      rules: {
        "@next/next/no-img-element": "off",
        "react-hooks/exhaustive-deps": "off",
        "@next/next/no-html-link-for-pages": "off",
      },
    },
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
  ],
}
