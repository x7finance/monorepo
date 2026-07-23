import { expect, test } from "../fixtures/test"
import { ALL_ROUTES } from "../lib/routes"

// Every route must return a non-error status, render the app shell, and produce
// zero real console errors (hydration/runtime). This is the broad safety net.
test.describe("smoke: every route renders cleanly", () => {
  for (const route of ALL_ROUTES) {
    test(`renders ${route.path}`, async ({ page, consoleErrors }) => {
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      })

      expect(response?.status(), `HTTP status for ${route.path}`).toBeLessThan(
        400
      )

      // App shell (body) is present, and the page isn't a blank/error screen.
      await expect(page.locator("body")).toBeVisible()

      // Give client components time to hydrate / stream (PPR routes).
      await page.waitForTimeout(1500)

      expect(
        consoleErrors,
        `console errors on ${route.path}:\n${consoleErrors.join("\n")}`
      ).toEqual([])
    })
  }
})
