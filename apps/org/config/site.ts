import { SocialsEnum, X7LinksEnum } from "common"
import {
  Discord,
  Github,
  Medium,
  Reddit,
  Telegram,
  Twitter,
  YouTube,
} from "icons"

import { SiteConfig } from "types"
import { env } from "@/env.mjs"
import {
  CommunityLinks,
  DashboardLinksEnum,
  DocsLinks,
  LoansLinksEnum,
  MarketingLinks,
  NftsLinkEnum,
  ProductsLinkEnum,
  TokenLinksEnum,
} from "@/lib/types/links"

export const siteConfig: SiteConfig = {
  name: "X7 Finance",
  description:
    "X7 Finance is a revolutionary project in the Decentralized Finance (DeFi) space, offering innovative smart contracts that provide visionary ideas with access to leveraged seed capital. Our platform features an Automated Market Making (AMM) Decentralized Exchange (DEX), a Lending Pool, and Initial Liquidity Loans, all governed by a democratic Decentralized Anonymous Organization (DAO). We offer a unique opportunity for project launchers, capital providers, system governors, and traders to participate in a trustless, permissionless, and censorship-resistant financial ecosystem. Join us in redefining the future of finance.",
  url: process.env.NODE_ENV === "production" ? "https://www.x7finance.org" : "",
  ogImage: `${env.NEXT_PUBLIC_ASSETS_URL}/images/open-graph/background.png`,
  links: {
    twitter: SocialsEnum.twitter,
    github: SocialsEnum.github,
  },
}

export const NOT_FOUND_LINKS = [
  {
    name: "Documentation",
    href: DocsLinks.Index,
    description: "Learn how to launch on Xchange.",
  },
  {
    name: "Marketplace",
    href: DashboardLinksEnum.Marketplace,
    description: "Buy and sell X7 Finance NFTs",
  },
  {
    name: "Guides",
    href: DocsLinks.Guides,
    description: "Comprehensive guides on how to launch an a pair on Xchange.",
  },
  {
    name: "Whitepaper",
    href: DocsLinks.Whitepaper,
    description: "Read the X7 Finance whitepaper from our founding devs.",
  },
]

export const DESKTOP_NAV_LINKS = [
  { name: "Get Started", href: MarketingLinks.GetStarted },
  { name: "Tokens", href: TokenLinksEnum.Index },
  { name: "Docs", href: DocsLinks.Index },
  {
    name: "Dashboard",
    href: DashboardLinksEnum.Index,
  },
  { name: "Loans", href: LoansLinksEnum.Index },
  { name: "Blog", href: MarketingLinks.Blog },
  { name: "Trade", href: X7LinksEnum.Xchange, isExternal: true },
]

export const MOBILE_NAV_LINKS = [
  { href: MarketingLinks.GetStarted, name: "Get Started" },
  {
    href: DashboardLinksEnum.Index,
    name: "Live Token Pairs",
  },
  {
    href: DashboardLinksEnum.Contracts,
    name: "Tokens",
  },
  { href: MarketingLinks.Blog, name: "Blog" },
]

export const DASHBOARD_TABS_NAV = [
  { name: "Dashboard", href: DashboardLinksEnum.Index },
  { name: "Loans", href: DashboardLinksEnum.Loans },
  { name: "Documentation", href: DocsLinks.Index },
  { name: "Contracts", href: DashboardLinksEnum.Contracts },
  { name: "NFTs", href: DashboardLinksEnum.Marketplace },
  { name: "DAO", href: DashboardLinksEnum.DAO },
]

export const FOOTER_NAVIGATION = {
  product: [
    { name: "Xchange", href: ProductsLinkEnum.Xchange },
    { name: "X7D", href: TokenLinksEnum.X7D },
    { name: "X7R", href: TokenLinksEnum.X7R },
    { name: "X7101", href: TokenLinksEnum.X7101 },
    { name: "X7102", href: TokenLinksEnum.X7102 },
    { name: "X7103", href: TokenLinksEnum.X7103 },
    { name: "X7104", href: TokenLinksEnum.X7104 },
    { name: "X7105", href: TokenLinksEnum.X7105 },
  ],
  explore: [
    { name: "Whitepaper", href: DocsLinks.Whitepaper },
    { name: "Docs", href: DocsLinks.Index },
    { name: "Templates", href: DocsLinks.IntegratingTemplates },

    // need to add these pages
    { name: "Integration", href: DocsLinks.Integrating },
    { name: "Guides", href: DocsLinks.Guides },
    { name: "FAQs", href: DocsLinks.FAQ },
    { name: "Community", href: CommunityLinks.Index },
  ],
  marketplace: [
    { name: "Loans", href: LoansLinksEnum.Index },
    { name: "Pioneers", href: NftsLinkEnum.Pioneers },
    { name: "Liquidity Maxi", href: NftsLinkEnum.LiquidityMaxi },
    { name: "Borrowing Maxi", href: NftsLinkEnum.BorrowingMaxi },
    { name: "DEX Maxi", href: NftsLinkEnum.DexMaxi },
    { name: "Ecosystem Maxi", href: NftsLinkEnum.EcosystemMaxi },
    { name: "Magister", href: NftsLinkEnum.Magister },
  ],
  community: [
    { name: "DAO", href: DashboardLinksEnum.DAO },
    { name: "On-Chains", href: DocsLinks.Onchains },
    { name: "Telegram", href: SocialsEnum.telegram },
    { name: "Twitter", href: SocialsEnum.twitter },
    { name: "Discord", href: SocialsEnum.discord },
    { name: "Announcements", href: SocialsEnum.announcements },
    { name: "Blog", href: MarketingLinks.Blog },
    { name: "Snapshot", href: SocialsEnum.snapshot },
  ],
  socials: [
    {
      name: "Telegram",
      href: SocialsEnum.telegram,
      icon: Telegram,
    },
    {
      name: "Discord",
      href: SocialsEnum.discord,
      icon: Discord,
    },
    {
      name: "Twitter",
      href: SocialsEnum.twitter,
      icon: Twitter,
    },
    {
      name: "YouTube",
      href: SocialsEnum.youtube,
      icon: YouTube,
    },
    {
      name: "Reddit",
      href: SocialsEnum.reddit,
      icon: Reddit,
    },
    {
      name: "GitHub",
      href: SocialsEnum.github,
      icon: Github,
    },
  ],
}
