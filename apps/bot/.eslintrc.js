module.exports = {
  root: true,
  extends: ['custom'],
  env: {
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@next/next/no-img-element': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
};
