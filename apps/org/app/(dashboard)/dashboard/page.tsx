import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Web3Wrapper } from "@/components/web3/wrapper"
import { DashboardContainer } from "@/app/(dashboard)/components/dashboard-container"
import { DashboardTitle } from "@/app/(dashboard)/components/dashboard-title"
import { LivePairs } from "@/app/(dashboard)/components/livePairs"

const metadata = {
  title: "Live Pairs & Contracts",
  description:
    "Stay updated with X7 Finance's Live Pairs Dashboard: A real-time platform showcasing all the latest pairs launching on Xchange. Our dashboard provides comprehensive data on each pair, allowing you to make informed trading decisions. Track the performance of your favorite pairs, discover new trading opportunities, and navigate the DeFi market with confidence. Experience the pulse of decentralized trading with X7 Finance's Live Pairs Dashboard.",
  slug: "/dashboard",
  section: "dashboard",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function DashboardIndexPage() {
  return (
    <div className="xl:max-w-none">
      <DashboardTitle
        title="Live Pairs"
        subHeader="The latest pairs created on Xchange"
        secondaryButton={{
          text: "Trade NFTs",
          href: "https://blur.io/collection/x7-pioneer",
        }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <LivePairs />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
