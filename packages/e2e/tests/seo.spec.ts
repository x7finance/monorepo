import { expect, test } from "../fixtures/test"

const SAMPLE_ROUTES = ["/", "/swap", "/docs", "/tokens/x7r", "/nfts", "/about"]

test.describe("SEO metadata", () => {
  for (const path of SAMPLE_ROUTES) {
    test(`${path} has a title and social metadata`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" })

      // Non-empty <title>.
      await expect(page).toHaveTitle(/.+/)

      // og:title present.
      expect(
        await page.locator('meta[property="og:title"]').count(),
        `og:title on ${path}`
      ).toBeGreaterThan(0)

      // Non-empty meta description.
      await expect(
        page.locator('meta[name="description"]').first()
      ).toHaveAttribute("content", /.+/)
    })
  }
})
