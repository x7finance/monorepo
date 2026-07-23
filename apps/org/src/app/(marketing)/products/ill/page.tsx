import type { Metadata } from "next"

import { SiteContentContainer } from "~/lib/components/core/site-content-container"
import { UnderConstruction } from "~/lib/components/core/under-construction"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

import { Heading } from "../../_components/heading"

const metadata = {
  title: "Liquidity Loans",
  description:
    "Explore X7 Finance's Liquidity Loans: Innovative DeFi solutions designed to provide initial liquidity to Automated Market Making (AMM) trading pairs with borrowed capital. Learn how these unique loan mechanisms, including Simple, Interest Only, and Amortizing loans, can reduce the amount of capital locked to a pair, provide leverage to the system, and increase liquidity and market capitalization. Unlock new opportunities in the world of decentralized finance with X7 Finance's Liquidity Loans.",
  slug: "/products/ill",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function InitialLiquidityLoansPage() {
  return (
    <div>
      <Heading
        id={"ills"}
        title={"Liquidity Loans"}
        subHeader="Liquidity Loans are a new way to bootstrap liquidity for new tokens"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
