import type { Metadata } from "next"

import { UnderConstruction } from "~/lib/components/core/under-construction"
import { generateMetadataFromDoc } from "~/lib/utils/generateMetadataFromDoc"

const metadata = {
  title: "X7 DAO",
  description:
    "Join the X7 Finance DAO Governance Platform: A democratic space where X7 DAO members can actively participate in the decision-making process of the protocol. Propose, discuss, and vote on key protocol parameters, tokenomics, profit allocation, and the long-term fate of locked liquidity. Contribute to the evolution of our DeFi ecosystem and shape the future of decentralized finance with X7 Finance's DAO Governance Platform.",
  slug: "/vote",
}

export function generateMetadata(): Metadata {
  return generateMetadataFromDoc(metadata)
}

export default function DAOPage() {
  return (
    <div className="xl:max-w-none">
      <UnderConstruction description="Here you will find the future home for X7 DAO voting, discussion and pertinent data relevent to X7 DAO" />
    </div>
  )
}
