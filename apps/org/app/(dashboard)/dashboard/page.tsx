import { Metadata } from "next"

import { DashboardContainer } from "@/components/dashboard-container"
import { DashboardSubheader } from "@/components/dashboard-subheader"
import { DashboardTitle } from "@/components/dashboard-title"
import { PairsTable } from "@/components/pairsTable"
import { SplittersOverview } from "@/components/splittersOverview"
import { Web3Wrapper } from "@/components/web3-wrapper"
import { generateMetadataFromDoc } from "@/app/(docs)/docs/(docs.utils)/generateMetadataFromDoc"

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
    <div className="my-10 xl:max-w-none">
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
          <PairsTable />

          <DashboardSubheader
            id="splits"
            title="Live Ecosystem Splits"
            description="A detailed breakdown of where liquidity and funds are being moved through the ecosystem"
          />
          <SplittersOverview />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
