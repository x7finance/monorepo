import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export default function AmortizingLoanPage() {
  return (
    <div>
      <Heading
        id={"amortizing"}
        title={"Amortizing Loans"}
        subHeader="Amortizing loans are a new way to bootstrap liquidity for new tokens"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
