import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT ?? 3000;
const isCi = process.env.CI;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = isCi ? process.env.ENVIRONMENT_URL : `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html", { outputFolder: "test-report", open: "never" }],
  ],
  outputDir: "./test-results",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    baseURL,
  },
  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  // ...(isCi
  //   ? {}
  //   : {
  //       webServer: {
  //         command: "cd ../../ && pnpm run dev",
  //         url: baseURL,
  //         timeout: 120 * 1000,
  //         reuseExistingServer: true,
  //       },
  //     }),
  reportSlowTests: null,
  timeout: 1000000,
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
