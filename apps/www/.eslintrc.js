module.exports = {
  root: true,
  extends: ['custom'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@next/next/no-img-element': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
}
