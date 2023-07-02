import "./env.mjs"

import withNextIntl from "next-intl/plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding")

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        encoding: false,
      }
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
    }
    config.resolve.extensions = [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ]

    return config
  },
  images: {
    domains: [
      process.env.NODE_ENV === "development"
        ? "localhost"
        : "assets.x7finance.org",
      "mux.com",
      "stream.mux.com",
      "img.x7.finance",
      "images.unsplash.com",
      "x7.finance",
    ],
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
}

export default withNextIntl(
  // This is the default (also the `src` folder is supported out of the box)
  "./i18n.ts"
)(nextConfig)
