import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { SiteContentContainer } from "@/components/site-content-container"
import { Heading } from "@/app/[locale]/(marketing)/components/heading"

const metadata = {
  title: "Magister NFT",
  description:
    "Explore X7 Finance's Magister NFT: A unique digital asset that provides holders with elevated governance rights within the X7 DeFi ecosystem. Learn how the Magister NFT can enhance your participation in our democratic DAO governance, provide a stronger voice in decision-making, and unlock new opportunities in shaping the future of decentralized finance. Understand the mechanics, benefits, and potential returns of our Magister NFT and redefine your decentralized governance experience.",
  slug: "/nfts/magister",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function MagisterNftPage() {
  return (
    <div>
      <Heading
        id={"magister"}
        title={"Magister NFT"}
        subHeader="Veto power in DAO votes"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          Each Magister token will cost 50 ETH to mint, and that ETH will go
          directly into token liquidity across the ecosystem. The Magister token
          also offers discounts on dex trading and loan origination.
          <div>
            MAGISTER NFTs are designed to give investors responsible access to
            higher DAO voting privileges. Providing this ensures a proper array
            of checks and balances to the ecosystem. The MAGISTER NFTs also
            provide owners with the similar high tier benefits of Ecosystem,
            Liquidity, Dex and Borrower Maxi NFTs.
            <ul>
              <li>Majority MAGISTER vote overrides 50-75% yea DAO vote</li>
              <li>50% discount on DEX LP fee</li>
              <li>20% loan origination fee reduction</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
