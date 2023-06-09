import type { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"

const metadata = {
  title: "Interest Only Initial Liquidity Loan",
  description:
    "Explore X7 Finance's Interest Only Initial Liquidity Loan: A pioneering DeFi solution that provides initial liquidity to an Automated Market Making (AMM) trading pair with borrowed capital, while only requiring the payment of interest during the loan term. Understand how this innovative loan mechanism offers flexibility, enhances liquidity, and fosters market capitalization. Delve into the mechanics, benefits, and potential returns of our Interest Only Initial Liquidity Loan and navigate the decentralized finance landscape with confidence.",
  slug: "/loans/interest",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function InterestOnlyLoanPage() {
  return (
    <div>
      <Heading
        id={"interest-only"}
        title={"Interest Only Loan"}
        subHeader="The Simple Loan is a straightforward way to bootstrap liquidity for new tokens"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
