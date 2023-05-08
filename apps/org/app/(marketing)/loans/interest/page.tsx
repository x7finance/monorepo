import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

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
          here is the content
        </div>
      </SiteContentContainer>
    </div>
  )
}
