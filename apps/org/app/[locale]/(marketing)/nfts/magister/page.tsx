import type { Metadata } from "next"
import { GradientTypes } from "@/site-components/gradients"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { getRandomPioneerNumber } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardLinksEnum } from "@/lib/types/links"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"
import { SectionStep } from "../../_components/section-step"

const metadata = {
  title: "Magister NFT",
  description:
    "Uncover X7 Finance's Magister NFT: A unique digital asset that offers holders exclusive benefits in our DAO governance. Learn how the Magister NFT can enhance your governance experience, provide preferential rates, and unlock new opportunities in the DeFi market. Understand the mechanics, benefits, and potential returns of our Magister NFT and optimize your decentralized finance journey.",
  slug: "/nfts/magister",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function MagisterPage() {
  return (
    <div>
      <Heading
        id={"magister"}
        title={"Magister NFT"}
        subHeader="Veto power in DAO votes"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <SectionStep
            showLeadIn={false}
            header="Magister NFTs are designed to give investors responsible access to higher DAO voting privileges."
            subHeader="Providing this ensures a proper array of checks and balances to the ecosystem. The MAGISTER NFTs also provide owners with the similar high tier benefits of Ecosystem, Liquidity, Dex and Borrower Maxi NFTs. Each Magister token will cost 50 ETH to mint, and that ETH will go directly into token liquidity across the ecosystem. The Magister token also offers discounts on dex trading and loan origination."
            pioneerId={getRandomPioneerNumber()}
            gradient={GradientTypes.redLight}
            checkColor="text-rose-600"
            highlightHeader="Provide checks and balances"
            highlights={[
              "Majority Magisters vote overrides 50-75% yes DAO vote",
              "50% discount on Xchange LP fee",
              "20% loan origination fee reduction",
            ]}
            primaryAction={{
              text: "Buy Magister NFT",
              href: DashboardLinksEnum.Marketplace,
            }}
          />
        </div>
      </SiteContentContainer>
    </div>
  )
}
