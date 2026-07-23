import { expect, test } from "../fixtures/test"

// Guards the accessibility fixes: icon-only controls must expose an accessible
// name (aria-label) so they're operable by keyboard/screen-reader users.
test.describe("accessibility: icon controls are labelled", () => {
  test("swap flip button has an accessible name", async ({ page }) => {
    await page.goto("/swap", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1500)
    await expect(
      page.getByRole("button", { name: "Swap input and output tokens" })
    ).toBeVisible()
  })

  test("mobile menu toggle has an accessible name", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/swap", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible({
      timeout: 15000,
    })
  })
})
