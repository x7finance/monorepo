const withMarkdoc = require('@markdoc/next.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md'],
  trailingSlash: true,
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        encoding: false,
        // crypto: require.resolve('crypto-browserify'),
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    return config;
  },
  images: {
    domains: [
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'assets.x7finance.org',
    ],
  },
};

module.exports = withMarkdoc()(nextConfig);
