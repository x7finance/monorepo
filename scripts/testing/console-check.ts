#!/usr/bin/env bun

/**
 * Console Error/Warning Checker
 * Visits every page in apps/org and collects console.error/console.warn output.
 * Outputs structured METRIC lines for autoresearch.
 */

import { chromium, type ConsoleMessage } from "@playwright/test"

const BASE_URL = "https://x7-org.localhost:1355"

// All static pages to visit (skip dynamic [param] routes)
const PAGES = [
  "/",
  "/about",
  "/blog",
  "/community",
  "/getstarted",
  "/ill",
  "/ill/amortizing",
  "/ill/interest",
  "/ill/simple",
  "/nfts",
  "/nfts/borrowing-maxi",
  "/nfts/dex-maxi",
  "/nfts/ecosystem-maxi",
  "/nfts/liquidity-maxi",
  "/nfts/magister",
  "/nfts/pioneers",
  "/products",
  "/products/ill",
  "/products/xchange",
  "/styles",
  "/tokens",
  "/tokens/x7100",
  "/tokens/x7d",
  "/tokens/x7dao",
  "/tokens/x7r",
  "/dashboard",
  "/dashboard/contracts/hubs",
  "/dashboard/contracts/splitters",
  "/dashboard/marketplace",
  "/dashboard/pioneer",
  "/docs",
  "/swap",
  "/create",
  "/deployer",
  "/fund",
  "/governance",
  "/lending",
  "/liquidity",
  "/vote",
]

interface ConsoleEntry {
  page: string
  type: "error" | "warning"
  text: string
}

async function main() {
  const entries: ConsoleEntry[] = []

  // Launch browser - ignore HTTPS errors for localhost
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    // Suppress known third-party noise
    bypassCSP: true,
  })

  for (const path of PAGES) {
    const url = `${BASE_URL}${path}`
    const page = await context.newPage()
    const pageEntries: ConsoleEntry[] = []

    page.on("console", (msg: ConsoleMessage) => {
      const type = msg.type()
      if (type === "error" || type === "warning") {
        const text = msg.text()

        // Filter out known noise
        if (isKnownNoise(text)) return

        pageEntries.push({
          page: path,
          type: type === "error" ? "error" : "warning",
          text,
        })
      }
    })

    // Also capture uncaught page errors
    page.on("pageerror", (err) => {
      pageEntries.push({
        page: path,
        type: "error",
        text: `[PageError] ${err.message}`,
      })
    })

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })
      // Wait a bit more for async effects
      await page.waitForTimeout(2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      pageEntries.push({
        page: path,
        type: "error",
        text: `[NavigationError] ${message}`,
      })
    }

    entries.push(...pageEntries)
    await page.close()
  }

  await browser.close()

  // Report results
  const errors = entries.filter((e) => e.type === "error")
  const warnings = entries.filter((e) => e.type === "warning")

  // Group by page for readable output
  const byPage = new Map<string, ConsoleEntry[]>()
  for (const entry of entries) {
    const existing = byPage.get(entry.page) ?? []
    existing.push(entry)
    byPage.set(entry.page, existing)
  }

  // Print details
  for (const [pagePath, pageEntries] of byPage) {
    console.error(`\n--- ${pagePath} (${pageEntries.length} issues) ---`)
    for (const entry of pageEntries) {
      const prefix = entry.type === "error" ? "❌" : "⚠️"
      // Truncate long messages
      const text =
        entry.text.length > 200 ? entry.text.slice(0, 200) + "..." : entry.text
      console.error(`  ${prefix} ${text}`)
    }
  }

  const totalErrors = errors.length
  const totalWarnings = warnings.length
  const totalCount = totalErrors + totalWarnings
  const pagesWithIssues = byPage.size
  const cleanPages = PAGES.length - pagesWithIssues

  console.error(`\n=== Summary ===`)
  console.error(
    `Total: ${totalCount} (${totalErrors} errors, ${totalWarnings} warnings)`
  )
  console.error(
    `Pages: ${cleanPages}/${PAGES.length} clean, ${pagesWithIssues} with issues`
  )

  // Structured output for autoresearch
  console.log(`METRIC error_count=${totalCount}`)
  console.log(`METRIC errors=${totalErrors}`)
  console.log(`METRIC warnings=${totalWarnings}`)
  console.log(`METRIC clean_pages=${cleanPages}`)
  console.log(`METRIC pages_with_issues=${pagesWithIssues}`)

  process.exit(totalCount > 0 ? 1 : 0)
}

function isKnownNoise(text: string): boolean {
  const NOISE_PATTERNS = [
    // Browser extension noise
    /chrome-extension:\/\//i,
    /moz-extension:\/\//i,
    // Favicon
    /favicon\.ico/i,
    // Source map warnings
    /Failed to parse source map/i,
    // DevTools
    /Download the React DevTools/i,
    /Download the Apollo DevTools/i,
    // HMR / dev-only
    /\[HMR\]/i,
    /Fast Refresh/i,
    /\[turbopack\]/i,
    // Third-party service errors (network)
    /ERR_NAME_NOT_RESOLVED/i,
    // Content Security Policy reports (we're testing with bypassCSP)
    /Content Security Policy/i,
    /Refused to/i,
    // React hydration false positives from extensions
    /Minified React error #418/i,
    /Minified React error #423/i,
    // next.js dev overlay
    /⚠ Fast Refresh/i,
    /Unhandled Runtime Error/i,
    // Lit dev mode warning (third-party: RainbowKit/WalletConnect)
    /Lit is in dev mode/i,
  ]

  return NOISE_PATTERNS.some((pattern) => pattern.test(text))
}

main().catch((err) => {
  console.error("Fatal error:", err)
  console.log("METRIC error_count=999")
  console.log("METRIC errors=999")
  console.log("METRIC warnings=0")
  console.log("METRIC clean_pages=0")
  console.log("METRIC pages_with_issues=0")
  process.exit(1)
})
