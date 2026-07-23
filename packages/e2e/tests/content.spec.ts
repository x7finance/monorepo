import { expect, test } from "../fixtures/test"

test.describe("content rendering", () => {
  test("docs renders markdown content", async ({ page }) => {
    await page.goto("/docs", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1500)
    await expect(page.locator("h1, h2").first()).toBeVisible()
  })

  test("blog lists posts", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1500)
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible()
  })

  test("swap page shows the swap form", async ({ page }) => {
    await page.goto("/swap", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1500)
    // The token flip control is part of the rendered swap form.
    await expect(
      page.getByRole("button", { name: "Swap input and output tokens" })
    ).toBeVisible()
  })
})
