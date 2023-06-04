import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Simple Loan",
  description:
    "The Simple Loan in X7 Finance is a loan mechanism with a 25% origination fee of the borrowed capital, requiring full repayment of the principal by the end of the loan term, and offering a 5% liquidation bounty.",
}

export default function SimpleLoanPage() {
  return (
    <div>
      <Heading id={"simple"} title={"Simple Loan"} subHeader="" />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
