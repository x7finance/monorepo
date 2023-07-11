import type { Metadata } from "next"
import { GradientTypes } from "@/site-components/gradients"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { getRandomPioneerNumber } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardLinksEnum } from "@/lib/types/links"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"
import { SectionStep } from "../../_components/section-step"

const metadata = {
  title: "Liquidty Maxi NFT",
  description:
    "Uncover X7 Finance's Borrowing Maxi NFT: A unique digital asset that offers holders exclusive benefits in our lending pools. Learn how the Borrowing Maxi NFT can enhance your borrowing provision experience, provide preferential rates, and unlock new opportunities in the DeFi market. Understand the mechanics, benefits, and potential returns of our Borrowing Maxi NFT and optimize your decentralized finance journey.",
  slug: "/nfts/liquidity-maxi",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function BorrowMaxiPage() {
  return (
    <div>
      <Heading
        id={"borrow-maxi"}
        title={"Borrowing Maxi NFT"}
        subHeader="Borrow at lower costs"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <SectionStep
            showLeadIn={false}
            header="Borrowing Maxi NFTs will provide borrowers within Xchange, a significant advantage in their loan terms."
            subHeader="Owning this NFT will reduce overall risk for lenders and borrowers while simultaneously allowing easier liquidity acquisition for DeFi entrepreneurs."
            pioneerId={getRandomPioneerNumber()}
            gradient={GradientTypes.redLight}
            checkColor="text-rose-600"
            highlightHeader="Preserve Capital while borrowing"
            highlights={[
              "10% loan origination fee reduction",
              "20% loan premium discount",
            ]}
            primaryAction={{
              text: "Buy Borrowing Maxi NFT",
              href: DashboardLinksEnum.Marketplace,
            }}
          />
        </div>
      </SiteContentContainer>
    </div>
  )
}
