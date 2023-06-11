import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/(marketing)/components/heading"

const metadata = {
  title: "Ecosystem Maxi NFT",
  description:
    "Discover X7 Finance's Ecosystem Maxi NFT: A unique digital asset that provides holders with comprehensive benefits across the entire X7 DeFi ecosystem. Learn how the Ecosystem Maxi NFT can enhance your DeFi experience, provide preferential rates, and unlock new opportunities in trading, lending, and governance. Understand the mechanics, benefits, and potential returns of our Ecosystem Maxi NFT and maximize your decentralized finance journey.",
  slug: "/nfts/ecosystem-maxi",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
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
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          The Ecosystem Maxi NFTs are for your everyday X7 maximalist. Ownership
          will provide traders with added flexibility during their trading
          experience between trading pairs.
          <div>
            <ul>
              <li>25% fee discount on X7100</li>
              <li>10% fee discount on X7DAO and X7R</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
