const withMarkdoc = require('@markdoc/next.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md'],
  trailingSlash: true,
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = withMarkdoc()(nextConfig);
