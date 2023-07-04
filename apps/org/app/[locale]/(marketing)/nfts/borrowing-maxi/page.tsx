import { Metadata } from "next"
import { SiteContentContainer } from "@/site-components/site-content-container"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Heading } from "@/app/[locale]/(marketing)/(marketing.components)/heading"

const metadata = {
  title: "Borrowing Maxi NFT",
  description:
    "Dive into X7 Finance's Borrowing Maxi NFT: A unique digital asset that provides holders with exclusive borrowing privileges within the X7 DeFi ecosystem. Learn how owning a Borrowing Maxi NFT can enhance your borrowing capacity, provide flexible loan terms, and unlock new financial opportunities. Understand the mechanics, benefits, and potential returns of our Borrowing Maxi NFT and redefine your decentralized finance experience.",
  slug: "/nfts/borrowing-maxi",
  section: "default",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function BorrowingMaxiPage() {
  return (
    <div>
      <Heading
        id={"borrowing-maxi"}
        title={"Borrowing Maxi NFT"}
        subHeader="Borrow at lower costs"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          Borrowing Maxi NFTs will provide borrowers within our ILO Dex platform
          a significant advantage in their loan terms. Owning this NFT will
          reduce overall risk for lenders and borrowers while simultaneously
          allowing easier liquidity acquisition for DeFi entrepreneurs.
          <div>
            <ul>
              <li>10% loan origination fee reduction</li>
              <li>20% loan premium discount</li>
            </ul>
          </div>
        </div>
      </SiteContentContainer>
    </div>
  )
}
