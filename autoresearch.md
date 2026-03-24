# Autoresearch: Zero Console Errors

## Objective
Eliminate all console.error and console.warn output across every page in apps/org.
The benchmark visits 39 pages via Playwright and collects browser console output.

## Result: ✅ ACHIEVED — 0 errors across all 39 pages (was 82)

## Metrics
- **Primary**: error_count (count, lower is better) — the optimization target
- **Secondary**: errors, warnings, clean_pages, pages_with_issues

## How to Run
`./autoresearch.sh` — outputs `METRIC name=number` lines.
Requires dev server running at https://x7-org.localhost:1355

## Files in Scope
- `apps/org/src/` — all app source code
- `packages/*/src/` — shared package source code
- `scripts/testing/console-check.ts` — the benchmark script (can update filters)

## Off Limits
- No new dependencies
- Don't change API behavior or public component interfaces
- No React anti-patterns (conditional hooks, hooks in JSX, hooks after early returns)
- Pages must render without hydration mismatches

## Constraints
- `bun run checks` must pass (format, lint, typecheck)
- Each fix should be targeted — one error category at a time

## What's Been Tried

### Wins
1. **Replaced `nextjs-darkmode` Core with custom DarkModeInit** (82→57, -25)
   - `Core` from nextjs-darkmode rendered `<script>` tags causing React 19 warnings
   - Created `apps/org/src/lib/components/utils/dark-mode.tsx` — client-only `useEffect` approach
   - Created `apps/org/src/lib/hooks/use-dark-mode.ts` — custom hook replacing `useMode`
   - No flash of wrong theme since HTML defaults to `className="dark"`

2. **Dynamic import MobileNavigation with ssr:false** (57→41, -16)
   - Base UI `Dialog.Trigger` generates SSR/CSR-mismatched IDs causing hydration failures
   - Created `apps/org/src/lib/components/core/client-mobile-nav.tsx` as wrapper
   - Uses `next/dynamic` with `ssr: false` (requires client component wrapper)
   - Note: xchange pages bail out to CSR entirely, so they never hit hydration warnings

3. **Fixed StaticTable duplicate keys** (dashboard: 14→0)
   - `packages/ui/src/static-table.tsx`: accessor `"token"` didn't match data property `name`
   - Changed key to use `String(index)` — static tables don't reorder

4. **Fixed DonutChart DOM prop spreading** (hubs/splitters: 2→0)
   - `arc-path.tsx`: spread `restItemRenderrops` onto `<path>` included arbitrary data props
   - `legend-item.tsx`: same issue with `<rect>`
   - Fixed both to explicitly pass only `fill`, `opacity`, `stroke`

5. **Fixed blog post keys** (blog: 1→0)
   - Changed `key={post.id}` to `key={post.id ?? post.slug ?? post.title}`

6. **Fixed lending/liquidity keys** (lending: 4→0, liquidity: 7→0)
   - `loan-terms-view.tsx`: added `?? loan-${idx}` fallback
   - `my-positions.tsx`: appended index to contractAddress key

### Filtered as known noise
- **Lit dev mode warnings** — third-party (RainbowKit/WalletConnect), dev-only
- **element.ref removed in React 19** — react-hook-form library issue
- **External resource 404s** — Uniswap token logo URLs that don't exist
- **LCP image warnings** — performance hints, not errors
- **CSP/Refused directives** — Content Security Policy reports
- **HMR/turbopack** — dev-only hot reload messages

### Key Insights
- The UI package tsconfig extends `next-build.json` which has `noEmit: true` — dist was built with explicit override
- xchange pages bail out to CSR (`BAILOUT_TO_CLIENT_SIDE_RENDERING: next/dynamic`), avoiding hydration issues
- Marketing pages hydrate normally and are more sensitive to SSR/CSR mismatches
- `suppressHydrationWarning` on `<html>` only suppresses attribute mismatches on that element, not children
