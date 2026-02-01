"use client"

import { Fragment } from "react"
import { useReadContract } from "wagmi"

import { AllPairsLength } from "@x7/contracts"
import { X7ContractsEnum } from "@x7/sdk"
import { useTradeChartPanelNewest } from "@x7/ui"
import { SwapChartNewestRow } from "~/app/(xchange)/_components/swap/swap-chart-newest-row"

const ITEMS_PER_PAGE = 16

export function TokenTicker() {
  const [showTradeChartPanelNewest] = useTradeChartPanelNewest()

  const { data } = useReadContract({
    address: X7ContractsEnum.XchangeFactory,
    // oxlint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    abi: AllPairsLength as any,
    functionName: "allPairsLength",
  })

  const pairsCount = parseInt(data?.toString() ?? "0", 10)

  if (pairsCount === 0) {
    return <></>
  }

  const pairsToDisplay = Array.from(
    { length: Math.min(pairsCount - 1, ITEMS_PER_PAGE) },
    (_, idx) => pairsCount - 1 - idx
  )

  if (!showTradeChartPanelNewest) {
    return null
  }

  return (
    <div className="relative mt-16 flex h-[40px] items-center overflow-x-hidden border-b border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="z-10 flex h-full items-center border-r border-zinc-300 bg-zinc-50 px-4 dark:border-zinc-700 dark:bg-zinc-900">
        <span className="whitespace-nowrap text-xs text-black dark:text-white">
          🔥 Hot Pairs
        </span>
      </div>
      <div className="animate-marquee whitespace-nowrap">
        {pairsToDisplay.map((id, key) => (
          <Fragment key={`loan-${id}`}>
            <SwapChartNewestRow order={key} id={id} />
          </Fragment>
        ))}
      </div>

      <div className="absolute animate-marquee2 whitespace-nowrap pl-40">
        {pairsToDisplay.map((id, key) => (
          <Fragment key={`loan-${id}`}>
            <SwapChartNewestRow order={key} id={id} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
