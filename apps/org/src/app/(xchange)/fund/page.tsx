import type { Metadata } from "next"

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { FundBase } from "./base"

const metadata = {
  title: "Xchange Funding",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/fund",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function FundingPage() {
  return (
    <div className="relative mx-auto mb-40">
      <div className="flex-1">
        <div className="mx-auto">
          <FundBase />
        </div>
      </div>
    </div>
  )
}
