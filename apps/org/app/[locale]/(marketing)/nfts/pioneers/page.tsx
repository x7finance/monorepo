import type { Metadata } from "next"
import { GradientTypes } from "@/site-components/gradients"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { getRandomPioneerNumber } from "@x7/utils"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/_components/heading"
import { SectionStep } from "../../_components/section-step"

const metadata = {
  title: "Pioneer NFT",
  description:
    "Uncover X7 Finance's Pioneer NFT: A unique digital asset that offers holders exclusive benefits in real yield. Learn how the Pioneer NFT can enhance your real yield experience, and unlock new opportunities in the DeFi market. Understand the mechanics, benefits, and potential returns of our Pioneer NFT and optimize your decentralized finance journey.",
  slug: "/nfts/pioneer",
  section: "default",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function PionnersPage() {
  return (
    <div>
      <Heading
        id={"pioneer"}
        title={"Pioneer NFT"}
        subHeader="Rewarding Pioneers"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <SectionStep
            showLeadIn={false}
            header="Pioneer NFTs are a limited edition NFT that were gifted to early supporters of the X7 Finance."
            subHeader="Periodically, a percentage of all profits generated by the X7 ecosystem will be pushed to the Pioneer Pool, from there you can claim that reward anytime you choose."
            pioneerId={getRandomPioneerNumber()}
            gradient={GradientTypes.redLight}
            checkColor="text-rose-600"
            highlightHeader="Rewarding Pioneers"
            highlights={[
              "6% of the X7 Finance treasury, flows to the Pioneer Pool",
            ]}
            primaryAction={{
              text: "Buy Pioneer NFT",
              href: "https://pro.opensea.io/collection/x7-pioneer",
            }}
            secondaryAction={{
              text: "Claim Rewards",
              href: "https://x7.finance/x/nft/pioneer",
            }}
          />
        </div>
      </SiteContentContainer>
    </div>
  )
}
