import { Metadata } from "next"

import { DashboardContainer } from "@/components/dashboard-container"
import { DashboardTitle } from "@/components/dashboard-title"
import { UtitlityNfts } from "@/components/utilityNfts"
import { Web3Wrapper } from "@/components/web3-wrapper"

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "",
}

export default function MarketplacePage() {
  return (
    <div className="my-10 xl:max-w-none">
      <DashboardTitle
        title="NFT Marketplace"
        secondaryButton={{
          text: "Trade NFTs",
          href: "https://blur.io/collection/x7-pioneer",
        }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <UtitlityNfts />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
