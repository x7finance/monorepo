/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
  // Legacy webpack config for fallback
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@x7/dexie",
    "@x7/icons",
    "@x7/router",
    "@x7/sdk",
    "@x7/smart-order-router",
    "@x7/ui",
    "@x7/utils",
    "websocket",
  ],
  pageExtensions: ["ts", "tsx", "md"],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === "development" ? "http" : "https",
        hostname:
          process.env.NODE_ENV === "development"
            ? "localhost"
            : "assets.x7finance.org",
        port: process.env.NODE_ENV === "development" ? "3009" : "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "x7.mypinata.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.x7finance.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.x7finance.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/Uniswap/assets/master/blockchains/**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        port: "",
        pathname: "/coins/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // React Compiler (moved from experimental in Next.js 16)
  reactCompiler: true,
  // Cache profiles for streaming components (moved from experimental in Next.js 16)
  cacheLife: {
    default: {
      stale: 300, // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 3600, // 1 hour
    },
    seconds: {
      stale: 1,
      revalidate: 5,
      expire: 10,
    },
    minutes: {
      stale: 60,
      revalidate: 300,
      expire: 600,
    },
    hours: {
      stale: 3600,
      revalidate: 10800,
      expire: 86400,
    },
    days: {
      stale: 86400,
      revalidate: 604800,
      expire: 2592000, // 30 days
    },
    blockchain: {
      stale: 12, // ~1 block
      revalidate: 60,
      expire: 300,
    },
  },
  experimental: {
    // Build optimizations
    optimizePackageImports: [
      "@x7/icons",
      "@x7/ui",
      "@x7/utils",
      "@x7/sdk",
      "@tanstack/react-query",
      "recharts",
      "zod",
      "viem",
      "wagmi",
    ],
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  productionBrowserSourceMaps: false,
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
