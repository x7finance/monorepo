/* oxlint-disable @typescript-eslint/no-explicit-any */

/* oxlint-disable @typescript-eslint/no-unsafe-member-access */

"use client"

import dynamic from "next/dynamic"
import React from "react"

import type { Pair, Pool } from "@x7/sdk"
import type { SwapRoute } from "@x7/smart-order-router"
import { useTradeChartPanelLiquidity } from "@x7/ui"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@x7/ui/sheet"
import { Tag } from "@x7/ui/tag"
import type { Native, Token } from "@x7/utils"
import { Protocol } from "@x7/utils"

import { SwapChartLiquidityAccordion } from "../(accordion)/swap-chart-liquidity-accordion"

// recharts (~730KB parsed) lives only in these two bar charts, which render
// only when this liquidity sheet is opened. Load them lazily so recharts stays
// out of the swap route's initial JS and only downloads on demand.
const SwapChartLiquidityBarChartV2 = dynamic(
  () =>
    import("../(chart)/swap-chart-liquidity-bar-chart-v2").then(
      (m) => m.SwapChartLiquidityBarChartV2
    ),
  { ssr: false }
)
const SwapChartLiquidityBarChartV3 = dynamic(
  () =>
    import("../(chart)/swap-chart-liquidity-bar-chart-v3").then(
      (m) => m.SwapChartLiquidityBarChartV3
    ),
  { ssr: false }
)

interface SwapChartPanelLiquiditySheetProps {
  route?: SwapRoute
  token0: Token | Native | undefined
  token1: Token | Native | undefined
}

export function SwapChartPanelLiquiditySheet({
  route,
  token0,
  token1,
}: SwapChartPanelLiquiditySheetProps) {
  const [showTradeChartPanelLiquidity, setShowTradeChartPanelLiquidity] =
    useTradeChartPanelLiquidity()

  const protocol = route?.trade.swaps[0]?.route.protocol

  const pools = route?.trade.swaps[0]?.route.pools ?? []
  const path = route?.trade.swaps[0]?.route.path ?? []
  const isRouteFound = pools.length > 0

  return (
    <Sheet
      open={showTradeChartPanelLiquidity}
      onOpenChange={setShowTradeChartPanelLiquidity}
    >
      <SheetContent side="left">
        <SheetHeader className="">
          <SheetTitle className="font-heading">Liquidity Reserves</SheetTitle>
          <div className="text-sm text-muted-foreground">
            Reserves of your selected route.
            <div className="my-1">
              <Tag color="emerald" variant="large">
                {path.map((token: any, tokenIdx: number) => (
                  <React.Fragment key={token.address ?? token.symbol}>
                    {token.symbol}
                    {tokenIdx < path.length - 1 && "-"}
                  </React.Fragment>
                ))}
              </Tag>
            </div>
          </div>
        </SheetHeader>
        {isRouteFound ? (
          <div className="space-y-8">
            {pools.map((pool, poolIndex) => {
              const pair = pool as Pair
              return (
                <div
                  key={`${pool.token0.address}-${pool.token1.address}`}
                  className="flex flex-col items-center justify-center"
                >
                  <h3 className="mb-2 font-heading text-lg font-semibold">
                    Hop {poolIndex + 1} Pool: {pool.token0.symbol}/
                    {pool.token1.symbol}
                  </h3>
                  {protocol === Protocol.V2 ? (
                    <SwapChartLiquidityBarChartV2
                      route={route}
                      pair={pair}
                      protocol={protocol}
                      isRouteFound={isRouteFound}
                      token0={token0}
                      token1={token1}
                    />
                  ) : protocol === Protocol.V3 ? (
                    <SwapChartLiquidityBarChartV3
                      pool={pool as Pool}
                      protocol={protocol}
                      isRouteFound={isRouteFound}
                    />
                  ) : null}
                </div>
              )
            })}{" "}
            <SwapChartLiquidityAccordion route={route} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-center">No route selected.</p>
          </div>
        )}
        <SheetFooter className="pt-2"></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
