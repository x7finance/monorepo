import { DashboardContainer } from "@/components/dashboard-container"
import { DashboardTitle } from "@/components/dashboard-title"
import { UnderConstruction } from "@/components/under-construction"
import { Web3Wrapper } from "@/components/web3-wrapper"

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
          <UnderConstruction
            description={`The future home of our very own NFT Marketplace`}
          />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
