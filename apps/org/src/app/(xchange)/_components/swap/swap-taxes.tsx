import React from "react"

import type { SwapRoute } from "@x7/smart-order-router"

export function SwapTaxes({ route }: { route: SwapRoute }) {
  const hasTaxes = route.route.some((r) =>
    r.tokenPath.some((token) => token.buyFeeBps || token.sellFeeBps)
  )

  if (!hasTaxes) return null

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-secondary-foreground">Token taxes</span>
      <div className="flex items-center divide-x divide-zinc-200 dark:divide-zinc-200/5">
        {route.route
          .flatMap((r) =>
            r.tokenPath.flatMap((token) => ({
              b: token.buyFeeBps
                ? (Number(token.buyFeeBps) / 10000) * 100
                : undefined,
              s: token.sellFeeBps
                ? (Number(token.sellFeeBps) / 10000) * 100
                : undefined,
              token: token.symbol,
            }))
          )
          .map(({ b, s, token }) => (
            <span
              key={token}
              className="text-right text-xs font-semibold text-secondary-foreground"
            >
              {b || s ? `${token}: ${b ?? s}%` : null}
            </span>
          ))}
      </div>
    </div>
  )
}
