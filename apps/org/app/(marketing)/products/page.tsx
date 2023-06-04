import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Products",
  description:
    "Discover X7 Finance's Innovative DeFi Products: Experience seamless, trustless trading with our Automated Market Making (AMM) Decentralized Exchange (DEX), manage funds and loans with our Lending Pool, launch projects effortlessly with our Initial Liquidity Loans, and participate in our democratic Decentralized Anonymous Organization (DAO). Our multi-chain rollout ensures a refined experience across Ethereum, Binance Smart Chain (BSC), and Polygon. Explore how X7 Finance is revolutionizing the DeFi space.",
}

export default function ProductsPage() {
  return (
    <div>
      <Heading
        id={"products"}
        title={"Products"}
        subHeader="X7 Protocol is a suite of products that enable users permissionless access to the world of DeFi"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
