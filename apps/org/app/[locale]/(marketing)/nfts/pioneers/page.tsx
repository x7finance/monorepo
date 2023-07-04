import { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"
import { UnderConstruction } from "@/site-components/under-construction"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "Pioneers NFT",
  description:
    "Discover X7 Finance's Pioneers NFT Collection: A unique series of digital assets that celebrate the early supporters and contributors of the X7 DeFi ecosystem. Learn how each Pioneer NFT represents a milestone in our journey, provides exclusive benefits to holders, and serves as a token of our appreciation. Understand the significance, benefits, and potential returns of our Pioneers NFT Collection and join us in commemorating the pioneers of decentralized finance.",
  slug: "/nfts/pioneers",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function PioneersPage() {
  return (
    <div>
      <Heading
        id={"pioneers"}
        title={"Pioneers NFT"}
        subHeader="Pioneers NFTs were a limited edition NFT that were gifted to early supporters of the X7 Finance."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
