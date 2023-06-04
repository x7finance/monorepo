import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Amortizing Initial Liquidity Loan",
  description: "",
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
