import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export const metadata: Metadata = {
  title: "Borrowing Maxi NFT",
  description: "",
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
