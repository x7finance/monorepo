import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { Web3Wrapper } from "@/components/web3/wrapper"
import { DashboardContainer } from "@/app/(dashboard)/components/dashboard-container"
import { DashboardTitle } from "@/app/(dashboard)/components/dashboard-title"
import { SplittersOverview } from "@/app/(dashboard)/components/splittersOverview"

const metadata = {
  title: "Ecosystem Splits",
  description:
    "Dive into X7 Finance's Smart Contracts Showcase: A comprehensive platform featuring all of X7's innovative DeFi smart contracts. Explore our Automated Market Making (AMM) contracts, lending pool contracts, initial liquidity loan contracts, and more. Understand the mechanics behind our DeFi solutions and how they contribute to a seamless, trustless, and efficient financial ecosystem. Discover the power of decentralized finance with X7 Finance's Smart Contracts Showcase.",
  slug: "/dashboard/splits",
  section: "dashboard",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function EcosystemSplitsPage() {
  return (
    <>
      <div className="xl:max-w-none">
        <DashboardTitle
          title="Ecosystem Splits"
          subHeader="A detailed breakdown of where liquidity and funds are being moved through the ecosystem"
          secondaryButton={{
            text: "Tokenomics",
            href: "/docs/whitepaper/tokenomics/",
          }}
        />
        <Web3Wrapper>
          <DashboardContainer>
            <SplittersOverview />
          </DashboardContainer>
        </Web3Wrapper>
      </div>
    </>
  )
}
