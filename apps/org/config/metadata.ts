import { env } from "@/env.mjs"

import { siteConfig } from "./site"

export const SITE_METADATA = {
  title: {
    default: `X7 Finance: Revolutionizing Decentralized Finance with Innovative Smart Contracts and Leveraged Capital Solutions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "X7 Finance",
    "Decentralized Finance",
    "Automated Market Making",
    "Decentralized Exchange",
    "Lending Pool",
    "Initial Liquidity Loan",
    "Tokenomics",
    "Multi-chain Rollout",
    "Ethereum and ERC20 tokens",
    "Decentralized Anonymous Organization",
    "Trustless and Permissionless Finance",
    "Censorship-resistant Finance",
    "Decentralized architecture and governance",
    "Crypto investment opportunities",
    "Leveraged seed capital",
    "Risk mitigation in crypto lending",
    "Arbitrage opportunities in crypto",
  ],
  authors: [
    {
      name: "X7 Finance",
      url: "https://www.x7finance.org",
    },
  ],
  creator: "x7finance",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${env.NEXT_PUBLIC_ASSETS_URL}/images/open-graph/background.png`],
    creator: "@X7_Finance",
  },
  icons: {
    icon: `${env.NEXT_PUBLIC_ASSETS_URL}/images/icons/favicon.ico`,
    shortcut: `${env.NEXT_PUBLIC_ASSETS_URL}/images/icons/favicon-16x16.png`,
    apple: `${env.NEXT_PUBLIC_ASSETS_URL}/images/icons/apple-touch-icon-120x120.png`,
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}
