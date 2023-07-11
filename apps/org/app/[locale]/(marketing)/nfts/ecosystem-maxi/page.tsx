import type { Metadata } from "next"
import { GradientTypes } from "@/site-components/gradients"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { getRandomPioneerNumber } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardLinksEnum } from "@/lib/types/links"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"
import { SectionStep } from "../../_components/section-step"

const metadata = {
  title: "Ecosystem Maxi NFT",
  description:
    "Uncover X7 Finance's Ecosystem Maxi NFT: A unique digital asset that offers holders exclusive benefits in our native tokens. Learn how the Ecosystem Maxi NFT can enhance your trading provision experience, provide preferential rates, and unlock new opportunities in the DeFi market. Understand the mechanics, benefits, and potential returns of our Ecosystem Maxi NFT and optimize your decentralized finance journey.",
  slug: "/nfts/ecosystem-maxi",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function EcosystemMaxiPage() {
  return (
    <div>
      <Heading
        id={"ecosystem-maxi"}
        title={"Ecosystem Maxi NFT"}
        subHeader="Lower fees on trades"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <SectionStep
            showLeadIn={false}
            header="The Ecosystem Maxi NFTs are for your everyday X7 maximalist."
            subHeader="Ownership will provide traders with added flexibility during their trading experience between trading pairs."
            pioneerId={getRandomPioneerNumber()}
            gradient={GradientTypes.redLight}
            checkColor="text-rose-600"
            highlightHeader="Preserve Capital while trading"
            highlights={[
              "25% fee discount on X7100",
              "10% fee discount on X7DAO and X7R",
            ]}
            primaryAction={{
              text: "Buy Ecosystem Maxi NFT",
              href: DashboardLinksEnum.Marketplace,
            }}
          />
        </div>
      </SiteContentContainer>
    </div>
  )
}
