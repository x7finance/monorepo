import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"

export const metadata: Metadata = {
  title: "Liquidty Maxi NFT",
  description: "",
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
