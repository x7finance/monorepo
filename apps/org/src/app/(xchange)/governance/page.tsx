import type { Metadata } from "next"

import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { GovernanceBase } from "./_components/base"

const metadata = {
  title: "Xchange Liquidity",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/liquidity",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function GovernancePage() {
  return (
    <div className="relative mx-auto mb-40">
      <div className="flex-1">
        <div className="mx-auto">
          <GovernanceBase />
        </div>
      </div>
    </div>
  )
}
