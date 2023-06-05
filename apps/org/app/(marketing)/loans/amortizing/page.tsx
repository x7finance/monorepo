import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"
import { generateMetadataFromDoc } from "@/app/(docs)/docs/(docs.utils)/generateMetadataFromDoc"

const metadata = {
  title: "Amortizing Initial Liquidity Loan",
  description:
    "Discover X7 Finance's Amortizing Initial Liquidity Loan: A unique DeFi solution designed to provide initial liquidity to an Automated Market Making (AMM) trading pair with borrowed capital. Learn how this innovative loan mechanism reduces the amount of capital locked to a pair, providing leverage to the system and increasing liquidity and market capitalization. Understand the mechanics, benefits, and potential returns of our Amortizing Initial Liquidity Loan and unlock new opportunities in the world of decentralized finance.",
  slug: "/loans/amortizing",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function AmortizingLoanPage() {
  return (
    <div>
      <Heading id={"amortizing"} title={"Amortizing Loan"} subHeader="" />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
