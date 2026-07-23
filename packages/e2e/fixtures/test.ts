import { test as base, expect, type Page } from "@playwright/test"

// Third-party / dev-only console noise that is not an app defect. Kept in sync
// with scripts/testing/console-check.ts.
const NOISE_PATTERNS: RegExp[] = [
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /favicon\.ico/i,
  /Failed to parse source map/i,
  /Download the React DevTools/i,
  /Download the Apollo DevTools/i,
  /\[HMR\]/i,
  /Fast Refresh/i,
  /\[turbopack\]/i,
  /ERR_NAME_NOT_RESOLVED/i,
  /Content Security Policy/i,
  /Refused to/i,
  /Minified React error #418/i,
  /Minified React error #423/i,
  /Unhandled Runtime Error/i,
  /Lit is in dev mode/i,
  /Failed to load resource.*404/i,
  /Accessing element\.ref was removed/i,
  /was detected as the Largest Contentful Paint/i,
]

export function isConsoleNoise(text: string): boolean {
  return NOISE_PATTERNS.some((p) => p.test(text))
}

interface Fixtures {
  // Collects real (non-noise) console errors + uncaught page errors for the
  // page under test, so a spec can assert the page rendered cleanly.
  consoleErrors: string[]
}

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }: { page: Page }, use) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      const type = msg.type()
      if (
        (type === "error" || type === "warning") &&
        !isConsoleNoise(msg.text())
      ) {
        errors.push(`[${type}] ${msg.text()}`)
      }
    })
    page.on("pageerror", (err) => {
      if (!isConsoleNoise(err.message)) {
        errors.push(`[pageerror] ${err.message}`)
      }
    })
    await use(errors)
  },
})

export { expect }
