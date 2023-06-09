import { Metadata } from "next"

import { generateMetadataFromDoc } from "@/lib/generateMetadataFromDoc"
import { UnderConstruction } from "@/components/under-construction"
import { Web3Wrapper } from "@/components/web3/wrapper"
import { DashboardContainer } from "@/app/(dashboard)/components/dashboard-container"
import { DashboardTitle } from "@/app/(dashboard)/components/dashboard-title"

const metadata = {
  title: "X7 DAO",
  description:
    "Join the X7 Finance DAO Governance Platform: A democratic space where X7 DAO members can actively participate in the decision-making process of the protocol. Propose, discuss, and vote on key protocol parameters, tokenomics, profit allocation, and the long-term fate of locked liquidity. Contribute to the evolution of our DeFi ecosystem and shape the future of decentralized finance with X7 Finance's DAO Governance Platform.",
  slug: "/dashboard/dao",
  section: "dashboard",
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromDoc(metadata)
}

export default function DAOPage() {
  return (
    <div className="my-10 xl:max-w-none">
      <DashboardTitle
        title="X7 DAO"
        primaryButton={{ text: "DAO Overview", href: "/docs/whitepaper/dao" }}
      />
      <Web3Wrapper>
        <DashboardContainer>
          <UnderConstruction description="Here you will find the future home for X7 DAO voting, discussion and pertinent data relevent to X7 DAO" />
        </DashboardContainer>
      </Web3Wrapper>
    </div>
  )
}
