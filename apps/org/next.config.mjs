import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
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
    ],
  },
  experimental: {
    scrollRestoration: true,
    appDir: true,
    serverComponentsExternalPackages: [""],
  },
}

export default nextConfig
