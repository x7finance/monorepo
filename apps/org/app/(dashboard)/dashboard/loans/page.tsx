import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardContainer } from "@/components/dashboard-container"
import { DashboardSubheader } from "@/components/dashboard-subheader"
import { DashboardTitle } from "@/components/dashboard-title"
import { LiveLoans } from "@/components/loansTable"
import { SplittersOverview } from "@/components/splittersOverview"
import { Web3Wrapper } from "@/components/web3-wrapper"

const metadata = {
  title: "Live Loans",
  description:
    "Stay updated with X7 Finance's Live Loans Dashboard: A real-time platform showcasing all the latest loans on Xchange. Our dashboard provides comprehensive data on each loan, allowing you to make informed trading decisions. Track the performance of your favorite loans, discover new trading opportunities, and navigate the DeFi market with confidence. Experience the pulse of decentralized trading with X7 Finance's Live Loans Dashboard.",
  slug: "/dashboard/loans",
  section: "dashboard",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function LoansPage() {
  return (
    <div className="my-10 xl:max-w-none">
      <DashboardTitle
        title="Live Loans"
        subHeader="The latest loans created on Xchange"
        secondaryButton={{
          text: "Trade NFTs",
          href: "https://blur.io/collection/x7-pioneer",
        }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <LiveLoans />

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
