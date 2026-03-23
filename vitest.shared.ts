/**
 * Shared Vitest Configuration
 *
 * Provides shared configuration presets that can be extended
 * by all packages in the monorepo. Ensures consistent behavior,
 * proper timeouts, and optimal performance across all test suites.
 *
 * Usage in package vitest.config.ts:
 *
 * ```ts
 * import { createNodeConfig, createReactConfig } from "../../vitest.shared"
 * export default createNodeConfig(__dirname)
 * ```
 */

import { resolve } from "node:path"

import type { UserConfig } from "vite"

const DEFAULT_MAX_WORKERS = process.env.VITEST_MAX_WORKERS ?? 2
const IS_CI = process.env.CI === "true"

/**
 * Standard timeouts for different test scenarios
 */
export const TIMEOUTS = {
  /** Standard test timeout (10 seconds) */
  test: 10_000,
  /** Hook timeout for setup/teardown (30 seconds) */
  hook: 30_000,
  /** Teardown timeout (10 seconds) */
  teardown: 10_000,
} as const

/**
 * Base test configuration shared by all packages
 */
export const baseTestConfig: Partial<UserConfig["test"]> = {
  globals: true,
  passWithNoTests: true,
  testTimeout: TIMEOUTS.test,
  hookTimeout: TIMEOUTS.hook,
  teardownTimeout: TIMEOUTS.teardown,
  maxWorkers: DEFAULT_MAX_WORKERS,
  isolate: true,
  reporters: IS_CI
    ? [
        "default",
        ["junit", { outputFile: "test-results/junit.xml" }],
        ["json", { outputFile: "test-results/results.json" }],
      ]
    : ["default"],
  pool: "forks",
}

/**
 * Standard coverage configuration
 */
export const baseCoverageConfig = {
  reporter: ["text", "json", "json-summary", "html"],
  all: true,
  exclude: [
    "node_modules/",
    "src/test/",
    "**/*.d.ts",
    "**/*.config.*",
    "**/index.ts",
  ],
  thresholds: {
    statements: 70,
    branches: 65,
    functions: 70,
    lines: 70,
  },
}

/**
 * Creates a complete Vitest configuration for Node.js environment packages
 *
 * @param dirname - The __dirname of the package's vitest.config.ts
 * @param overrides - Optional overrides for the configuration
 */
export function createNodeConfig(
  dirname: string,
  overrides?: {
    setupFiles?: string[]
    include?: string[]
    exclude?: string[]
    testTimeout?: number
    hookTimeout?: number
    teardownTimeout?: number
    pool?: "threads" | "forks"
    maxWorkers?: number
    isolate?: boolean
    environment?: string
  }
): UserConfig {
  const setupFiles = overrides?.setupFiles ?? []

  return {
    test: {
      ...baseTestConfig,
      environment: overrides?.environment ?? "node",
      setupFiles,
      include: overrides?.include ?? [
        "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      ],
      exclude: overrides?.exclude,
      testTimeout: overrides?.testTimeout ?? TIMEOUTS.test,
      hookTimeout: overrides?.hookTimeout ?? TIMEOUTS.hook,
      teardownTimeout: overrides?.teardownTimeout ?? TIMEOUTS.teardown,
      pool: overrides?.pool ?? "forks",
      maxWorkers: overrides?.maxWorkers,
      isolate: overrides?.isolate ?? true,
      coverage: baseCoverageConfig,
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(dirname, "./src") }],
    },
  }
}

/**
 * Creates a complete Vitest configuration for React component packages
 * Uses jsdom for DOM simulation.
 *
 * @param dirname - The __dirname of the package's vitest.config.ts
 * @param overrides - Optional overrides for the configuration
 */
export function createReactConfig(
  dirname: string,
  overrides?: {
    setupFiles?: string[]
    include?: string[]
    exclude?: string[]
    testTimeout?: number
    hookTimeout?: number
    teardownTimeout?: number
    environment?: "jsdom" | "happy-dom"
  }
): UserConfig {
  const setupFiles = overrides?.setupFiles ?? ["./src/test/setup.ts"]

  return {
    test: {
      ...baseTestConfig,
      environment: overrides?.environment ?? "jsdom",
      setupFiles,
      include: overrides?.include ?? [
        "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      ],
      exclude: overrides?.exclude,
      testTimeout: overrides?.testTimeout ?? TIMEOUTS.test,
      hookTimeout: overrides?.hookTimeout ?? TIMEOUTS.hook,
      teardownTimeout: overrides?.teardownTimeout ?? TIMEOUTS.teardown,
      css: true,
      coverage: baseCoverageConfig,
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(dirname, "./src") }],
    },
  }
}
