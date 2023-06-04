import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Initial Liquidity Loans",
  description: "",
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
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
