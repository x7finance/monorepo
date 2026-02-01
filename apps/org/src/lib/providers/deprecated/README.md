# Deprecated Providers - Rollback Instructions

These providers were replaced with Zustand stores on 2026-01-31 as part of the context provider refactoring.

## Why They Were Replaced

- **SwapStateProvider**: 499 lines, 18 state properties - caused unnecessary re-renders
- **LoanStateProvider**: 393 lines, 11 state properties - caused unnecessary re-renders
- **Provider Pyramid**: 10 levels deep nesting in app.tsx

## New Architecture

State is now managed by Zustand stores in:
- `~/lib/stores/swap/` - Swap state (tokens, amounts, quotes)
- `~/lib/stores/loan/` - Loan state (tokens, terms, quotes)

The backward-compatible hooks `useSwapState()` and `useLoanState()` are exported from these stores.

---

## ROLLBACK INSTRUCTIONS

If you need to rollback to the old Context-based providers:

### Step 1: Move providers back

```bash
mv apps/org/src/lib/providers/deprecated/swap-state.tsx apps/org/src/lib/providers/swap-state.tsx
mv apps/org/src/lib/providers/deprecated/loan.tsx apps/org/src/lib/providers/loan.tsx
```

### Step 2: Update app.tsx

Edit `apps/org/src/lib/providers/app.tsx`:

```diff
+ import { X7LoanStateProvider } from "~/lib/providers/loan";
+ import { X7SwapStateProvider } from "~/lib/providers/swap-state";

  const appInfo = {
    appName: "Xchange",
  };

+ const MemoizedX7SwapStateProvider = memo(X7SwapStateProvider);
+ const MemoizedX7LoanStateProvider = memo(X7LoanStateProvider);
  const MemoizedTooltipProvider = memo(TooltipProvider);
  const MemoizedSplashController = memo(SplashController);
```

Then update the provider hierarchy:

```diff
                <TransactionStoreProvider>
                  <AlphaRouterProvider>
+                   <MemoizedX7SwapStateProvider>
+                     <MemoizedX7LoanStateProvider>
                        <MemoizedTooltipProvider>
                          <MemoizedSplashController>
                            {mounted && props.children}
                            <div id="dialog-root" />
                          </MemoizedSplashController>
                        </MemoizedTooltipProvider>
+                     </MemoizedX7LoanStateProvider>
+                   </MemoizedX7SwapStateProvider>
                  </AlphaRouterProvider>
                </TransactionStoreProvider>
```

### Step 3: Update consumer imports

Replace all imports from stores back to providers:

```bash
# Find and replace in your editor or use sed:
# FROM: import { useSwapState } from "~/lib/stores/swap";
# TO:   import { useSwapState } from "~/lib/providers/swap-state";

# FROM: import { useLoanState } from "~/lib/stores/loan";
# TO:   import { useLoanState } from "~/lib/providers/loan";
```

Files that need import updates:
- `apps/org/src/app/(xchange)/_components/swap/swap-form.tsx`
- `apps/org/src/app/(xchange)/_components/swap/(hooks)/use-swap-form-logic.tsx`
- `apps/org/src/app/(xchange)/_components/swap/swap-routes.tsx`
- `apps/org/src/app/(xchange)/_components/swap/swap-implementations-tabbed.tsx`
- `apps/org/src/app/(xchange)/_components/swap/swap-stats.tsx`
- `apps/org/src/lib/components/core/settings/index.tsx`
- `apps/org/src/app/(xchange)/_components/loans/base.tsx`
- `apps/org/src/app/(xchange)/_components/loans/(sections)/loan-launch-price.tsx`
- `apps/org/src/app/(xchange)/_components/loans/(sections)/loan-summary.tsx`
- `apps/org/src/app/(xchange)/_components/loans/(sections)/loan-type-repayment-summary.tsx`
- `apps/org/src/app/(xchange)/_actions/generate-route.tsx`

### Step 4: Verify

```bash
bun turbo typecheck --filter=@x7/org
```

---

## Files in this folder

- `swap-state.tsx` - Original SwapStateProvider (Context-based)
- `loan.tsx` - Original LoanStateProvider (Context-based)
