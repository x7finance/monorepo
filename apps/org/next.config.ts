import type { NextConfig } from "next"
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "viem/chains"

const RPC_ENV_KEYS = [
  "NEXT_PUBLIC_DEFAULT_ETHER_RPC",
  "NEXT_PUBLIC_DEFAULT_ETHER_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_BSC_RPC",
  "NEXT_PUBLIC_DEFAULT_BSC_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_POLY_RPC",
  "NEXT_PUBLIC_DEFAULT_POLY_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_OPTI_RPC",
  "NEXT_PUBLIC_DEFAULT_OPTI_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_ARB_RPC",
  "NEXT_PUBLIC_DEFAULT_ARB_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_BASE_RPC",
  "NEXT_PUBLIC_DEFAULT_BASE_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_ETHER_TESTNET_RPC",
  "NEXT_PUBLIC_DEFAULT_ETHER_TESTNET_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_BSC_TESTNET_RPC",
  "NEXT_PUBLIC_DEFAULT_BSC_TESTNET_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_POLY_TESTNET_RPC",
  "NEXT_PUBLIC_DEFAULT_POLYGON_TESTNET_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_OPTI_TESTNET_RPC",
  "NEXT_PUBLIC_DEFAULT_OPTIMISM_TESTNET_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_ARB_TESTNET_RPC",
  "NEXT_PUBLIC_DEFAULT_ARBITRUM_TESTNET_RPC_FALLBACK",
  "NEXT_PUBLIC_DEFAULT_BASE_TESTNET_RPC",
  "NEXT_PUBLIC_DEFAULT_BASE_TESTNET_RPC_FALLBACK",
] as const

const SUPPORTED_CHAINS = [
  mainnet,
  sepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  polygon,
  polygonAmoy,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
] as const

function getRpcOrigin(value: string | undefined): string | undefined {
  if (!value) {
    return undefined
  }

  try {
    const url = new URL(value)

    return ["http:", "https:", "ws:", "wss:"].includes(url.protocol)
      ? url.origin
      : undefined
  } catch {
    return undefined
  }
}

const rpcConnectSources = Array.from(
  new Set([
    ...SUPPORTED_CHAINS.flatMap((chain) =>
      chain.rpcUrls.default.http.map((url) => new URL(url).origin)
    ),
    ...RPC_ENV_KEYS.map((key) => getRpcOrigin(process.env[key])).filter(
      (origin): origin is string => origin !== undefined
    ),
    // Established public RPC providers that may be selected as fallbacks.
    "https://rpc.ankr.com",
    "https://*.publicnode.com",
    "https://1rpc.io",
    "https://*.llamarpc.com",
    "https://*.quiknode.pro",
    "https://*.nodereal.io",
    "https://*.onfinality.io",
  ])
)

const nextConfig: NextConfig = {
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
              // Configured RPCs, viem defaults, and established public fallbacks
              ...rpcConnectSources,
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
        // Uniswap + Trust Wallet curated token logos are both served from
        // raw.githubusercontent.com under different org paths.
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
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
  // typedRoutes: true,
  pageExtensions: ["ts", "tsx", "js", "md"],
  reactStrictMode: true,
  // Configure cacheLife profiles for the `use cache` directive.
  // These profiles are available (but not applied automatically) to any
  // function/component that opts in via `"use cache"` + `cacheLife("<name>")`.
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife
  cacheLife: {
    // "max" profile - for static content that rarely changes
    max: {
      stale: 60 * 60 * 24 * 7, // 7 days on client
      revalidate: 60 * 60 * 24, // Revalidate every 24 hours on server
      expire: 60 * 60 * 24 * 365, // Expire after 1 year (effectively never)
    },
    // "hours" profile - for content that updates periodically
    hours: {
      stale: 60 * 60, // 1 hour on client
      revalidate: 60 * 30, // Revalidate every 30 minutes on server
      expire: 60 * 60 * 24, // Expire after 24 hours
    },
    // "minutes" profile - for frequently updated content
    minutes: {
      stale: 60 * 5, // 5 minutes on client
      revalidate: 60 * 2, // Revalidate every 2 minutes on server
      expire: 60 * 60, // Expire after 1 hour
    },
  },
  // Cache Components (Next 16.3): static/cached/dynamic split with PPR + instant
  // navigations. Replaces experimental.useCache/dynamicIO. Uncached dynamic data
  // must be wrapped in <Suspense> or cached with `use cache`, else the route is
  // opted out of instant-nav validation via `export const instant = false`.
  cacheComponents: true,
  experimental: {
    // TypeScript 7 (native) doesn't expose the legacy compiler API, so run
    // build-time type checking through the `tsc` CLI instead.
    useTypeScriptCli: true,
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
      "@rainbow-me/rainbowkit",
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
