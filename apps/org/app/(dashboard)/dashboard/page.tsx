import { Metadata } from "next"

import { DashboardContainer } from "@/components/dashboard-container"
import { DashboardSubheader } from "@/components/dashboard-subheader"
import { DashboardTitle } from "@/components/dashboard-title"
import { PairsTable } from "@/components/pairsTable"
import { SplittersOverview } from "@/components/splittersOverview"
import { Web3Wrapper } from "@/components/web3-wrapper"

export const metadata: Metadata = {
  title: "Live Pairs & Splits",
  description: "",
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
