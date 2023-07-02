import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/[locale]/(marketing)/components/heading"

const metadata = {
  title: "DEX Maxi NFT",
  description:
    "Explore X7 Finance's Dex Maxi NFT: A unique digital asset that offers holders exclusive benefits on our Automated Market Making (AMM) Decentralized Exchange (DEX). Learn how the Dex Maxi NFT can enhance your trading experience, provide preferential rates, and unlock new trading opportunities. Understand the mechanics, benefits, and potential returns of our Dex Maxi NFT and elevate your decentralized trading journey.",
  slug: "/nfts/dex-maxi",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function DexMaxiPage() {
  return (
    <div>
      <Heading
        id={"dex-maxi"}
        title={"DEX Maxi NFT"}
        subHeader="Lower costs on X7's LDEX"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          Dex Maxi NFTs provide users of our Dex an additional layer of
          flexibility during trading. Dex users will find this NFT useful
          towards a more frictionless trading experience.
          <div>
            <ul>
              <li>50% discount on DEX LP fee</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
