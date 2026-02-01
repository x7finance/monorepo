import type { Metadata } from "next"

import { CheckerProviderComponent } from "~/lib/providers/checker"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { XChangeSwap } from "../_components/swap/base"

import { TradeLines } from "./_components/trade-lines"

const metadata = {
  title: "Trust No One. Trust Code. Long Live Defi.",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function XchangeSwapPage() {
  return (
    <CheckerProviderComponent>
      <div className="relative mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
        <main className="w-full flex-1">
          <div className="my-8 flex justify-center">
            <XChangeSwap />
          </div>

          <TradeLines />
        </main>
      </div>
    </CheckerProviderComponent>
  )
}
