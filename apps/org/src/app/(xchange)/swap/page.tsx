import type { Metadata } from "next"

import { CheckerProviderComponent } from "~/lib/providers/checker"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { XChangeSwap } from "../_components/swap/base"

const metadata = {
  title: "Trust No One. Trust Code. Long Live Defi.",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/swap",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function XchangeSwapPage() {
  return (
    <CheckerProviderComponent>
      <div className="relative mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex justify-center">
            <div className="flex w-full flex-col items-center justify-center">
              <XChangeSwap />
            </div>
          </div>
        </div>
      </div>
    </CheckerProviderComponent>
  )
}
