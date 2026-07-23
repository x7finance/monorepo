import type { Metadata } from "next"

import { CheckerProviderComponent } from "~/lib/providers/checker"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { CreateBase } from "./_components/base"

const metadata = {
  title: "Create Coin",
  description:
    "X7 Finance: Transforming DeFi with smart contracts, AMM DEX, Lending Pool, and DAO-governed Liquidity Loans.",
  slug: "/create",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function CreateCoinPage() {
  return (
    <CheckerProviderComponent>
      <div className="relative mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <CreateBase />
            </div>
          </div>
        </div>
      </div>
    </CheckerProviderComponent>
  )
}
