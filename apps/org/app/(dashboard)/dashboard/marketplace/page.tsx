import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { UtitlityNfts } from "@/components/utilityNfts"
import { Web3Wrapper } from "@/components/web3/wrapper"
import { DashboardContainer } from "@/app/(dashboard)/components/dashboard-container"
import { DashboardTitle } from "@/app/(dashboard)/components/dashboard-title"

const metadata = {
  title: "NFT Marketplace",
  description:
    "Discover X7 Finance's NFT Marketplace: A specialized platform designed for the DeFi enthusiast. Our marketplace is home to exclusive Utility NFTs that provide holders with unique benefits and privileges within the X7 DeFi ecosystem. Trade and invest in these NFTs to unlock enhanced financial opportunities and potential returns. Experience the future of decentralized finance with X7 Finance's NFT Marketplace.",
  slug: "/dashboard/marketplace",
  section: "dashboard",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
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
