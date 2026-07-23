import { expect, test } from "../fixtures/test"
import { ALL_ROUTES } from "../lib/routes"

// Every route must return a non-error status, render the app shell, and produce
// no app-level defects (uncaught exceptions or hydration mismatches). Network /
// RPC console noise from the preview environment is intentionally ignored — see
// fixtures/test.ts. This is the broad safety net across the whole app.
test.describe("smoke: every route renders cleanly", () => {
  for (const route of ALL_ROUTES) {
    test(`renders ${route.path}`, async ({ page, appErrors }) => {
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      })

      expect(response?.status(), `HTTP status for ${route.path}`).toBeLessThan(
        400
      )

      // App shell renders (not a blank/error screen).
      await expect(page.locator("body")).toBeVisible()

      // Give client components time to hydrate / stream (PPR routes).
      await page.waitForTimeout(1500)

      expect(
        appErrors,
        `app errors on ${route.path}:\n${appErrors.join("\n")}`
      ).toEqual([])
    })
  }
})
