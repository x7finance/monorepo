import type { Metadata } from "next"
import { Web3Wrapper } from "@/site-components/web3-wrapper"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { DashboardContainer } from "../../(dashboard.components)/dashboard-container"
import { DashboardTitle } from "../../(dashboard.components)/dashboard-title"
import { LiveLoans } from "../../(dashboard.components)/loan"

const metadata = {
  title: "Live Loans",
  description:
    "Stay updated with X7 Finance's Live Loans Dashboard: A real-time platform showcasing all the latest loans on Xchange. Our dashboard provides comprehensive data on each loan, allowing you to make informed trading decisions. Track the performance of your favorite loans, discover new trading opportunities, and navigate the DeFi market with confidence. Experience the pulse of decentralized trading with X7 Finance's Live Loans Dashboard.",
  slug: "/dashboard/loans",
  section: "dashboard",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function LoansPage() {
  return (
    <div className="xl:max-w-none">
      <DashboardTitle
        title="Live Loans"
        subHeader="The latest loans created on Xchange"
        secondaryButton={{
          text: "View Loan Options",
          href: "/loans",
        }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <LiveLoans />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
