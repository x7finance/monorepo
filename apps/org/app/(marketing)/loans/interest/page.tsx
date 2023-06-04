import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Interest Only Initial Liquidity Loan",
  description: "",
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
