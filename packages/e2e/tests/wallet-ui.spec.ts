import { expect, test } from "../fixtures/test"

// Exercises the wallet-connect flow at the UI level — no real wallet/extension
// required. Verifies the connect CTA is present and opens the RainbowKit modal
// with wallet options.
test.describe("wallet connect UI", () => {
  test("connect button opens the wallet modal", async ({ page }) => {
    await page.goto("/swap", { waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1500)

    const connect = page.locator("#connectButton").first()
    await expect(connect).toBeVisible()
    await expect(connect).toContainText(/connect/i)

    await connect.click()

    // RainbowKit modal lists wallet options once open.
    await expect(page.getByText(/MetaMask/i).first()).toBeVisible({
      timeout: 10000,
    })
  })
})
