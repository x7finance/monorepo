/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { FC, ReactNode } from "react"
import { useMemo } from "react"

import { cn } from "@x7/css"
import type { Pool, RouteV2Wrapper, RouteV3Wrapper } from "@x7/sdk"
import { useTradeChartPanelLiquidity } from "@x7/ui"
import { SkeletonBox } from "@x7/ui/skeleton"
import type { Currency } from "@x7/utils"
import { Implementation, LogCodes, Protocol } from "@x7/utils"
import { useSwapState } from "~/lib/stores/swap"
import { log } from "~/lib/utils/log"
import {
  warningSeverity,
  warningSeverityClassName,
} from "~/lib/utils/warning-severity"

import { ImplementationIcon } from "./swap-implementation-logos"
import { MixedImplementationDisplay } from "./swap-mixed-implementation"
import { SwapTaxes } from "./swap-taxes"

const TradeStatRow: FC<{ label: string; value: ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-secondary-foreground">{label}</span>
    <span className="text-right text-xs font-semibold text-secondary-foreground">
      {value}
    </span>
  </div>
)

const implementationClassOverrides = {
  [Implementation.AERODROME]: "h-4 text-muted-foreground",
  [Implementation.UNISWAP]: "h-5",
  [Implementation.PANCAKESWAP]: "h-5",
  [Implementation.XCHANGE]: "h-5",
  [Implementation.SUSHISWAP]: "h-4 text-muted-foreground",
}

export const SimpleSwapTradeStats: FC = () => {
  const {
    state: { swapAmountString, route, slippage },
    loaders: { isQuoteLoading },
  } = useSwapState()
  const [showTradeChartPanelLiquidity, setShowTradeChartPanelLiquidity] =
    useTradeChartPanelLiquidity("tradeChartPanelLiquidity")
  const loading = Boolean(isQuoteLoading && !route?.quote)

  const { trade } = route ?? {}

  const implementation = useMemo(() => {
    if (!trade?.routes[0]) {
      return Implementation.MIXED
    }

    const route = trade.routes[0]

    if (route.protocol === Protocol.V3) {
      return (route as RouteV3Wrapper<Currency, Currency>).pools[0]?.poolType
    }
    if (route.protocol === Protocol.V2) {
      return (route as RouteV2Wrapper<Currency, Currency>).pairs[0]?.pairType
    }
    return Implementation.MIXED
  }, [trade])

  if (trade?.routes) {
    log.info(LogCodes.TRADE_ROUTES, trade.routes)
  }

  if (+swapAmountString > 0 && !!route && !isQuoteLoading) {
    return (
      <div
        data-testid="trade-summary-details"
        className="relative my-1 flex w-full flex-col rounded-lg border border-border bg-muted/50 px-2 py-2"
      >
        <h3 className="relative -top-1 font-heading text-sm text-muted-foreground/60">
          Trade Quote
        </h3>

        <TradeStatRow
          label="Price impact"
          value={
            loading || !trade?.priceImpact ? (
              <SkeletonBox className="h-4 w-[40px] py-0.5" />
            ) : trade.priceImpact ? (
              <span
                className={cn(
                  "text-right text-xs font-semibold",
                  warningSeverityClassName(warningSeverity(trade.priceImpact))
                )}
              >
                {`${trade.priceImpact.lessThan(0) ? "+" : trade.priceImpact.greaterThan(0) ? "-" : ""}${Math.abs(Number(trade.priceImpact.toFixed(2)))}%`}
              </span>
            ) : null
          }
        />

        <TradeStatRow
          label="Est. received"
          value={
            loading || !trade?.outputAmount ? (
              <SkeletonBox className="h-4 w-[120px] py-0.5" />
            ) : (
              `${trade.outputAmount.toFixed(6) ?? "0.00"} ${trade.outputAmount.currency.symbol ?? ""}`
            )
          }
        />

        <TradeStatRow
          label="Min. received"
          value={
            loading || !trade?.outputAmount ? (
              <SkeletonBox className="h-4 w-[100px] py-0.5" />
            ) : (
              `${trade.minimumAmountOut(slippage, trade.outputAmount).toFixed(6) ?? "0.00"} ${trade.outputAmount.currency.symbol ?? ""}`
            )
          }
        />

        <TradeStatRow
          label="Network fee"
          value={
            loading ||
            !route?.estimatedGasUsed ||
            route.estimatedGasUsed === "0" ? (
              <SkeletonBox className="h-4 w-[120px] py-0.5" />
            ) : route.estimatedGasUsedUSD ? (
              `$${route.estimatedGasUsedUSD.toFixed(4)} USD`
            ) : null
          }
        />

        <TradeStatRow
          label="Pool"
          value={
            loading || !implementation ? (
              <SkeletonBox className="h-4 w-[120px] py-0.5" />
            ) : implementation === Implementation.MIXED ? (
              <MixedImplementationDisplay
                pools={trade?.routes[0]?.pools as Pool[]}
              />
            ) : (
              <ImplementationIcon
                implementation={implementation}
                classNameOverrides={implementationClassOverrides}
              />
            )
          }
        />

        <TradeStatRow
          label="Route"
          value={
            loading || !route ? (
              <SkeletonBox className="h-4 w-[40px] py-0.5" />
            ) : (
              <button
                onClick={() =>
                  setShowTradeChartPanelLiquidity(!showTradeChartPanelLiquidity)
                }
                type="button"
                className="text-xs font-semibold text-emerald-500"
              >
                View
              </button>
            )
          }
        />

        {route && <SwapTaxes route={route} />}

        {/* // TODO: re-enable if anyone would ever want to trade to another address */}
        {/* {recipient && isAddress(recipient) && (
          <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-200/5">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Recipient
            </span>
            <span className="text-right text-sm text-secondary-foreground">
              <a
                target="_blank"
                href={Chain.from(chainId)?.getAccountUrl(recipient)}
                className={cn(
                  address !== recipient
                    ? "text-yellow-600"
                    : "text-zinc-700 dark:text-zinc-300",
                  "flex items-center gap-1 transition-all",
                )}
                rel="noreferrer"
              >
                <AddressToEnsResolver address={recipient}>
                  {({ isLoading, data }: { isLoading: boolean; data: any }) => {
                    return (
                      <>
                        {isLoading || !data ? shortenAddress(recipient) : data}
                      </>
                    );
                  }}
                </AddressToEnsResolver>
                {address !== recipient && (
                  <div>
                    Recipient is different from the connected wallet address. If
                    this is expected, ignore this warning.
                  </div>
                )}
              </a>
            </span>
          </div>
        )} */}
      </div>
    )
  }

  return null
}
