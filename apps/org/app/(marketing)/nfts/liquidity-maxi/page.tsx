import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/(marketing)/components/heading"

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
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          Liquidity Maxi NFTs are designed to provide added insurance to larger
          price movements. Ownership is for those who aim to preserve as much
          capital as possible while trading.
          <div>
            <ul>
              <li>50% fee discount on X7100</li>
              <li>25% fee discount on X7R</li>
              <li>15% fee discount on X7DAO</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
