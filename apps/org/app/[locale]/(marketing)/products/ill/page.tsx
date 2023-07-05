import type { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "Initial Liquidity Loans",
  description:
    "Explore X7 Finance's Initial Liquidity Loans: Innovative DeFi solutions designed to provide initial liquidity to Automated Market Making (AMM) trading pairs with borrowed capital. Learn how these unique loan mechanisms, including Simple, Interest Only, and Amortizing loans, can reduce the amount of capital locked to a pair, provide leverage to the system, and increase liquidity and market capitalization. Unlock new opportunities in the world of decentralized finance with X7 Finance's Initial Liquidity Loans.",
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
        title={"Initial Liquidity Loans"}
        subHeader="Initial Liquidity Loans are a new way to bootstrap liquidity for new tokens"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
