import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SiteContentContainer } from "@/components/site-content-container"
import { UnderConstruction } from "@/components/under-construction"

export const metadata: Metadata = {
  title: "Xchange",
  description:
    "Experience Xchange by X7 Finance: A peer-to-peer Automated Market Making (AMM) Decentralized Exchange (DEX) integrated with a novel trustless, permissionless on-chain undercollateralized loan origination and servicing system. Xchange offers seamless, trustless trading of ERC-20 tokens, providing unparalleled opportunities for crypto investors. Discover how Xchange is redefining decentralized trading and liquidity provision in the DeFi space.",
}

export default function XChangePage() {
  return (
    <div>
      <Heading
        id={"xchange"}
        title={"Xchange"}
        subHeader="Xchange is a decentralized exchange that allows users to swap tokens permissionlessly"
      />
      <SiteContentContainer>
        <div className="pt-10 mt-4 border-t border-zinc-900/5 dark:border-white/5">
          <UnderConstruction />
        </div>
      </SiteContentContainer>
    </div>
  )
}
