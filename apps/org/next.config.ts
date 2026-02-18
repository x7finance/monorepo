import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Security headers (migrated from middleware.ts)
  headers: async () => [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            // connect-src for blockchain RPC providers and web3 services
            [
              "connect-src 'self'",
              // Alchemy (mainnet and testnets)
              "https://*.alchemy.com",
              "https://*.alchemyapi.io",
              "wss://*.alchemy.com",
              // Infura (mainnet and testnets)
              "https://*.infura.io",
              "wss://*.infura.io",
              // DRPC
              "https://*.drpc.org",
              // Base RPC (mainnet and testnets)
              "https://mainnet.base.org",
              "https://sepolia.base.org",
              "https://goerli.base.org",
              // Ethereum RPC
              "https://eth.llamarpc.com",
              "https://cloudflare-eth.com",
              // WalletConnect
              "wss://*.walletconnect.com",
              "https://*.walletconnect.com",
              "wss://*.walletconnect.org",
              "https://*.walletconnect.org",
              // Reown AppKit (formerly Web3Modal)
              "https://*.web3modal.com",
              "https://*.web3modal.org",
              "https://api.web3modal.org",
              "wss://*.web3modal.com",
              // Reown
              "https://*.reown.com",
              "wss://*.reown.com",
            ].join(" "),
            "frame-ancestors 'none'",
            "font-src 'self' data:",
          ].join("; "),
        },
      ],
    },
  ],
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
  // Legacy webpack config for fallback
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push("pino-pretty", "encoding")
    return config
  },
  // Enables hot reloading for local packages without a build step
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
  // Cache Components enabled - uses React Server Components cache
  cacheComponents: true,
  // Cache profiles for streaming components
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
  // Partial Prerendering (PPR) - static shell with dynamic streaming
  experimental: {
    ppr: true,
    // Caching features
    dynamicOnHover: true,
    useCache: true,
    turbopackFileSystemCacheForDev: true,
    // Build optimizations
    optimizePackageImports: [
      "@x7/contracts",
      "@x7/css",
      "@x7/dexie",
      "@x7/icons",
      "@x7/router",
      "@x7/sdk",
      "@x7/smart-order-router",
      "@x7/tines",
      "@x7/token-lists",
      "@x7/ui",
      "@x7/utils",
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
}

export default nextConfig
