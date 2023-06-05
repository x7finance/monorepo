import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"
import { generateMetadataFromDoc } from "@/app/(docs)/docs/(docs.utils)/generateMetadataFromDoc"

const metadata = {
  title: "Interest Only Initial Liquidity Loan",
  description:
    "Explore X7 Finance's Interest Only Initial Liquidity Loan: A pioneering DeFi solution that provides initial liquidity to an Automated Market Making (AMM) trading pair with borrowed capital, while only requiring the payment of interest during the loan term. Understand how this innovative loan mechanism offers flexibility, enhances liquidity, and fosters market capitalization. Delve into the mechanics, benefits, and potential returns of our Interest Only Initial Liquidity Loan and navigate the decentralized finance landscape with confidence.",
  slug: "/loans/interest",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
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
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
