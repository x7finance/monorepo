// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

module.exports = {
  singleQuote: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@server/(.*)$',
    '^@nestjs/(.*)$',
    '^@dlt/(.*)$',
    '^@utils/(.*)$',
    '^@client/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: [require('@ianvs/prettier-plugin-sort-imports')],
};
