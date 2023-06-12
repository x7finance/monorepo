import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardLinksEnum } from "@/lib/types/links"
import { GradientTypes } from "@/components/gradients"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/(marketing)/components/heading"

import { SectionStep } from "../../components/section-step"

const metadata = {
  title: "Liquidty Maxi NFT",
  description:
    "Uncover X7 Finance's Liquidity Maxi NFT: A unique digital asset that offers holders exclusive benefits in our liquidity pools. Learn how the Liquidity Maxi NFT can enhance your liquidity provision experience, provide preferential rates, and unlock new opportunities in the DeFi market. Understand the mechanics, benefits, and potential returns of our Liquidity Maxi NFT and optimize your decentralized finance journey.",
  slug: "/nfts/liquidity-maxi",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function LiquidityMaxiPage() {
  return (
    <div>
      <Heading
        id={"liquidity-maxi"}
        title={"Liquidity Maxi NFT"}
        subHeader="Arbitrage optimizer"
      />
      <SiteContentContainer>
        <div className="mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <SectionStep
            showLeadIn={false}
            header="Liquidity Maxi NFTs are designed to provide added insurance to
            larger price movements"
            subHeader="X7 tokens carry a tax to fund liquidity, protocol development and
            marketing of the X7 ecosystem."
            pioneerId="3591"
            gradient={GradientTypes.redLight}
            checkColor="text-rose-600"
            highlightHeader="Preserve Capital while trading"
            highlights={[
              "50% fee discount on X7100",
              "25% fee discount on X7R",
              "15% fee discount on X7DAO",
              `We are expecting high levels of arbitrage amongst the x7 tokens and
              we believe this NFT will become more and more valuable to those
              arbitrators`,
            ]}
            primaryAction={{
              text: "Buy Liquidity Maxi NFT",
              href: DashboardLinksEnum.Marketplace,
            }}
          />
        </div>
      </SiteContentContainer>
    </div>
  )
}
