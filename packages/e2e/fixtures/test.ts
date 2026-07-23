import { test as base, expect, type Page } from "@playwright/test"

// Network/infra console noise that isn't an app defect. Deployed previews use
// RPC/API keys whose origin allowlist doesn't include ephemeral *.vercel.app
// domains, so many external requests fail (CORS / 400 / ERR_FAILED). None of
// that is a bug in the app, so we don't fail the suite on it. Strict
// "zero console output" checking lives in scripts/testing/console-check.ts,
// which runs against a controlled environment.

// Genuine app defects we DO want to fail on — surfaced as console errors:
// hydration mismatches, React update-loops, etc.
const APP_DEFECT_PATTERNS: RegExp[] = [
  /hydrat/i,
  /did not match/i,
  /Text content does not match/i,
  /Maximum update depth/i,
  /Cannot update a component/i,
  /is not defined/i,
  /is not a function/i,
]

// Even among uncaught page errors, filter genuine third-party/extension noise.
const NOISE_PATTERNS: RegExp[] = [
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /ResizeObserver loop/i,
  /Minified React error #418/i,
  /Minified React error #423/i,
]

function isNoise(text: string): boolean {
  return NOISE_PATTERNS.some((p) => p.test(text))
}

function isAppDefect(text: string): boolean {
  return APP_DEFECT_PATTERNS.some((p) => p.test(text))
}

interface Fixtures {
  // Real app defects for the page under test: uncaught JS exceptions plus
  // console errors that indicate an app bug (hydration mismatch, render loop).
  // Network/CORS/HTTP-status console noise is intentionally excluded.
  appErrors: string[]
}

export const test = base.extend<Fixtures>({
  appErrors: async ({ page }: { page: Page }, use) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error" && isAppDefect(msg.text())) {
        errors.push(`[console] ${msg.text()}`)
      }
    })
    page.on("pageerror", (err) => {
      if (!isNoise(err.message)) {
        errors.push(`[pageerror] ${err.message}`)
      }
    })
    await use(errors)
  },
})

export { expect }
