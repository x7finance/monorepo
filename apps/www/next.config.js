const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md'],
  trailingSlash: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: [
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'assets.x7finance.org',
    ],
  },
}

module.exports = withMarkdoc()(nextConfig)
