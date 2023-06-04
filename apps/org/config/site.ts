import { SocialsEnum } from "common"

import { SiteConfig } from "types"

export const siteConfig: SiteConfig = {
  name: "X7 Finance",
  description:
    "X7 Finance is a revolutionary project in the Decentralized Finance (DeFi) space, offering innovative smart contracts that provide visionary ideas with access to leveraged seed capital. Our platform features an Automated Market Making (AMM) Decentralized Exchange (DEX), a Lending Pool, and Initial Liquidity Loans, all governed by a democratic Decentralized Anonymous Organization (DAO). We offer a unique opportunity for project launchers, capital providers, system governors, and traders to participate in a trustless, permissionless, and censorship-resistant financial ecosystem. Join us in redefining the future of finance.",
  url: process.env.NODE_ENV === "production" ? "https://www.x7finance.org" : "",
  ogImage: "https://assets.x7finance.org/images/open-graph/background.png",
  links: {
    twitter: SocialsEnum.twitter,
    github: SocialsEnum.github,
  },
}
