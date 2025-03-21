import type { Metadata } from "next";

import { SiteContentContainer } from "~/lib/components/core/site-content-container";
import { UnderConstruction } from "~/lib/components/core/under-construction";
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc";
import { Heading } from "../../_components/heading";

const metadata = {
  title: "Amortizing Liquidity Loan",
  description:
    "Discover X7 Finance's Amortizing Liquidity Loan: A unique DeFi solution designed to provide initial liquidity to an Automated Market Making (AMM) trading pair with borrowed capital. Learn how this innovative loan mechanism reduces the amount of capital locked to a pair, providing leverage to the system and increasing liquidity and market capitalization. Understand the mechanics, benefits, and potential returns of our Amortizing Liquidity Loan and unlock new opportunities in the world of decentralized finance.",
  slug: "/loans/amortizing",
  section: "default",
};

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata);
}

export default function AmortizingLoanPage() {
  return (
    <div>
      <Heading id={"amortizing"} title={"Amortizing Loan"} subHeader="" />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  );
}
