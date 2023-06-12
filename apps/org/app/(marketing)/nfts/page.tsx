// import { Heading } from "@/components/heading"
import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"
import { Heading } from "@/app/(marketing)/components/heading"

const metadata = {
  title: "X7 Utility NFTs",
  description:
    "Discover X7 Finance's Utility NFTs: Unique digital assets that unlock exclusive benefits within the X7 DeFi ecosystem. From enhanced borrowing capacities and preferential trading rates to elevated governance rights, our Utility NFTs offer a range of privileges to holders. Learn how these NFTs can enhance your DeFi experience, provide tangible value, and unlock new financial opportunities. Experience the power of utility in the world of NFTs with X7 Finance.",
  slug: "/nfts",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function NftsPage() {
  return (
    <div>
      <Heading
        id={"utility-nfts"}
        title={"Utility NFTs"}
        subHeader="X7 Finance's Utility NFTs are unique digital assets that provide holders with exclusive benefits and privileges within the X7 ecosystem, enhancing their DeFi experience and potential returns."
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
