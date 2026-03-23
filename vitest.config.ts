import { defineConfig } from "vitest/config"

import { TIMEOUTS } from "./vitest.shared"

export default defineConfig({
  test: {
    projects: [
      "packages/*/vitest.config.{ts,mts,cts,js,mjs,cjs}",
      "apps/*/vitest.config.{ts,mts,cts,js,mjs,cjs}",
    ],
    globals: true,
    testTimeout: TIMEOUTS.test,
    hookTimeout: TIMEOUTS.hook,
    teardownTimeout: TIMEOUTS.teardown,
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/.next/**",
        "**/test/**",
        "**/tests/**",
        "**/*.test.*",
        "**/*.spec.*",
        "**/vitest.config.*",
        "**/vite.config.*",
        "**/playwright.config.*",
        "**/*.d.ts",
        "**/types/**",
        "**/coverage/**",
      ],
    },
  },
})
