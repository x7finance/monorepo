import type { Route } from "next";

import {
  Discord,
  Github,
  Reddit,
  Telegram,
  Twitter,
  Warpcast,
  YouTube,
} from "@x7/icons";
import { SocialsEnum } from "@x7/utils";

import { env } from "~/env.mjs";
import type { SiteConfig } from "~/types";
import {
  CommunityLinks,
  DashboardLinksEnum,
  DocsLinks,
  MarketingLinks,
  NftsLinkEnum,
  TokenLinksEnum,
  XchangeLinks,
} from "~/types/links";

export const siteConfig: SiteConfig = {
  name: "X7 Finance",
  description:
    "X7 Finance is a revolutionary project in the Decentralized Finance (DeFi) space, offering innovative smart contracts that provide visionary ideas with access to leveraged seed capital. Our platform features an Automated Market Making (AMM) Decentralized Exchange (DEX), a Lending Pool, and Liquidity Loans, all governed by a democratic Decentralized Anonymous Organization (DAO). We offer a unique opportunity for project launchers, capital providers, system governors, and traders to participate in a trustless, permissionless, and censorship-resistant financial ecosystem. Join us in redefining the future of finance.",
  url: `${env.NEXT_PUBLIC_APP_URL}`,
  links: {
    twitter: SocialsEnum.twitter,
    github: SocialsEnum.github,
  },
};

export const NOT_FOUND_LINKS = [
  {
    name: "Xchange",
    href: XchangeLinks.Swap,
    description: "Swap, provide, mint on Xchange.",
  },
  {
    name: "Dashboard",
    href: DashboardLinksEnum.Index,
    description: "Live data on trades, loans and everything else X7 Finance.",
  },
  {
    name: "Documentation",
    href: DocsLinks.Index,
    description: "Learn everything you need to be an Xchange Pioneer.",
  },
  {
    name: "Marketplace",
    href: DashboardLinksEnum.Marketplace,
    description: "Buy and sell X7 Finance NFTs.",
  },

  {
    name: "Whitepaper",
    href: DocsLinks.Whitepaper,
    description: "Read the X7 Finance whitepaper from our founding devs.",
  },
] satisfies { href: Route; name: string; description: string }[];

export const DESKTOP_NAV_LINKS = [
  { name: "Get Started", href: MarketingLinks.GetStarted },
  { name: "Dashboard", href: DashboardLinksEnum.Index },
  { name: "Tokens", href: TokenLinksEnum.Index },
  { name: "Docs", href: DocsLinks.Index },
  { name: "Blog", href: MarketingLinks.Blog },
] satisfies { href: Route; name: string; isExternal?: boolean }[];

export const MOBILE_NAV_LINKS = [
  { name: "Get Started", href: MarketingLinks.GetStarted },
  { name: "Dashboard", href: DashboardLinksEnum.Index },
  { name: "Tokens", href: TokenLinksEnum.Index },
  { name: "Docs", href: DocsLinks.Index },
  { name: "Blog", href: MarketingLinks.Blog },
] satisfies { href: Route; name: string }[];

export const DASHBOARD_TABS_NAV = [
  { name: "Ecosystem", href: DashboardLinksEnum.Index },
  { name: "NFTs", href: DashboardLinksEnum.Marketplace },
  { name: "Docs", href: DocsLinks.Index },
];

export const FOOTER_NAVIGATION = {
  tokens: [
    { name: "X7R", href: TokenLinksEnum.X7R },
    { name: "X7DAO", href: TokenLinksEnum.X7DAO },
    { name: "X7D", href: TokenLinksEnum.X7D },
    { name: "X7101-X7105", href: TokenLinksEnum.X7100 },
  ],
  explore: [
    { name: "Dashboard", href: DashboardLinksEnum.Index },
    { name: "Guides", href: DocsLinks.Guides },
    { name: "Integration", href: DocsLinks.Integrating },
    { name: "Whitepaper", href: DocsLinks.Whitepaper },
    { name: "Breakdowns", href: DocsLinks.Breakdowns },
    { name: "Onchains", href: DocsLinks.Breakdowns },
    { name: "FAQs", href: DocsLinks.FAQ },
  ],
  marketplace: [
    { name: "Lending", href: XchangeLinks.Lending },
    { name: "Pioneers", href: NftsLinkEnum.Pioneers },
    { name: "Liquidity Maxi", href: NftsLinkEnum.LiquidityMaxi },
    { name: "Borrowing Maxi", href: NftsLinkEnum.BorrowingMaxi },
    { name: "DEX Maxi", href: NftsLinkEnum.DexMaxi },
    { name: "Ecosystem Maxi", href: NftsLinkEnum.EcosystemMaxi },
    { name: "Magister", href: NftsLinkEnum.Magister },
  ],
  community: [
    { name: "Telegram", href: SocialsEnum.telegram },
    { name: "Twitter", href: SocialsEnum.twitter },
    { name: "Discord", href: SocialsEnum.discord },
    { name: "Warpcast", href: SocialsEnum.warpcast },
    { name: "Blog", href: MarketingLinks.Blog },
    { name: "Links", href: CommunityLinks.Index },
  ],
  xchange: [
    { name: "Swap", href: XchangeLinks.Swap },
    { name: "Liquidity", href: XchangeLinks.Liquidity },
    { name: "Loans", href: XchangeLinks.Lending },
    { name: "Fund", href: XchangeLinks.Fund },
    { name: "Vote", href: XchangeLinks.Vote },
  ],
  socials: [
    {
      name: "Telegram",
      href: SocialsEnum.telegram,
      icon: Telegram,
    },
    {
      name: "Twitter",
      href: SocialsEnum.twitter,
      icon: Twitter,
    },
    {
      name: "Discord",
      href: SocialsEnum.discord,
      icon: Discord,
    },
    {
      name: "Warpcast",
      href: SocialsEnum.warpcast,
      icon: Warpcast,
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
};
