const { join } = require('path');

module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // transform: {
  //   '^.+\\.tsx?$': 'esbuild-jest',
  //   '^.+\\.jsx?$': 'esbuild-jest',
  // },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
  ],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  resetMocks: true,
  coveragePathIgnorePatterns: [],
  coverageThreshold: null,
  moduleNameMapper: {
    // ... other module mappings if any
    '^utils$': join(__dirname, '..', '..', '..', 'utils', 'src', 'index.tsx'),
    '^ui$': join(__dirname, '..', '..', '..', 'ui', 'src', 'index.tsx'),
    '^hooks$': join(__dirname, '..', '..', '..', 'hooks', 'src', 'index.tsx'),
    '^common$': join(__dirname, '..', '..', '..', 'common', 'src', 'index.tsx'),
  },
};
