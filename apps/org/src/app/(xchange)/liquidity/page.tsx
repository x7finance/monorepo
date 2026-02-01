import type { Metadata } from "next"

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { LiquidityBase } from "./_components/base"

const metadata = {
  title: "Xchange Liquidity",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/liquidity",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function LiquidityPage() {
  return (
    <div className="relative mx-auto mb-96">
      <div className="flex-1">
        <div className="mx-auto">
          <LiquidityBase />
        </div>
      </div>
    </div>
  )
}
