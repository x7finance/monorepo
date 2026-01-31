// import withBundleAnalyzerCreator from "@next/bundle-analyzer";

// const withBundleAnalyzer = withBundleAnalyzerCreator({
//   enabled: process.env.ANALYZE === "true",
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
  // serverExternalPackages: ["pino", "pino-pretty"],
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
  experimental: {
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
    turbo: {
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
      resolveAlias: {
        "react-native": "react-native-web",
      },
    },
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    reactCompiler: true,
  },
  serverExternalPackages: ["pino", "pino-pretty"],
  productionBrowserSourceMaps: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

// export default withBundleAnalyzer(nextConfig);
