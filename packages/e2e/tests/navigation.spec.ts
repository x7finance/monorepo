import { expect, test } from "../fixtures/test"

test.describe("navigation", () => {
  test("client-side navigation via the xchange nav", async ({ page }) => {
    await page.goto("/lending", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1500)

    // "Swap" is a direct nav link (Liquidity/Lending are dropdown triggers).
    const swapLink = page
      .getByRole("link", { name: "Swap", exact: true })
      .first()
    await expect(swapLink).toBeVisible()
    await swapLink.click()

    await expect(page).toHaveURL(/\/swap/)
    await expect(page.locator("body")).toBeVisible()
  })

  test("mobile menu opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/swap", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(2000)

    const open = page.getByRole("button", { name: "Open navigation menu" })
    await expect(open).toBeVisible({ timeout: 15000 })
    await open.click()

    // Drawer content is revealed (a nav link).
    await expect(
      page.getByRole("link", { name: "Trade" }).first()
    ).toBeVisible()
  })
})
