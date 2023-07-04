import { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "Simple Initial Liquidity Loan",
  description:
    "Uncover X7 Finance's Simple Initial Liquidity Loan: A robust DeFi solution that provides initial liquidity to an Automated Market Making (AMM) trading pair with borrowed capital, requiring full repayment of the principal by the end of the loan term. Learn how this straightforward loan mechanism balances risk and reward, providing a reliable and efficient lending solution in the DeFi ecosystem. Understand the mechanics, benefits, and potential returns of our Simple Initial Liquidity Loan and enhance your decentralized finance journey.",
  slug: "/loans/simple",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
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
