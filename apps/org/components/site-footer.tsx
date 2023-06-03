import { SocialsEnum } from "common"
import {
  Discord,
  Github,
  Medium,
  Reddit,
  Telegram,
  Twitter,
  YouTube,
} from "icons"

import * as React from "react"
import Link from "next/link"

import {
  CommunityLinks,
  DashboardLinksEnum,
  DocsLinks,
  LoansLinksEnum,
  NftsLinkEnum,
  ProductsLinkEnum,
  TokenLinksEnum,
} from "@/lib/types/links"
import { ModeToggle } from "@/components/mode-toggle"

const navigation = {
  product: [
    { name: "XChange", href: ProductsLinkEnum.Xchange },
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
    { name: "Templates", href: DocsLinks.Templates },

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
    { name: "Medium", href: SocialsEnum.medium },
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
      name: "Medium",
      href: SocialsEnum.medium,
      icon: Medium,
    },
    {
      name: "GitHub",
      href: SocialsEnum.github,
      icon: Github,
    },
  ],
}

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={className} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">
                  Product
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-medium text-black dark:text-white">
                  Explore
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.explore.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">
                  Marketplace
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.marketplace.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-medium text-black dark:text-white cursor-pointer">
                  Community
                </h3>

                <ul role="list" className="mt-4 space-y-4">
                  {navigation.community.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 xl:mt-0">
            <span className="fill-black dark:fill-white">
              <svg viewBox="0 0 956 166" fill="none" className="w-72 xl:w-3/4">
                <path
                  d="M168.999 3.79239L48.5871 165.601H0V161.809L95.7658 31.9193H73.9369L47.5308 66.0509L0.704161 5.05652V0H168.999V3.79239Z"
                  fill="currentColor"
                />
                <path
                  d="M120.765 96.0808L95.0632 130.528L120.413 165.608H169V161.816L120.765 96.0808Z"
                  fill="currentColor"
                />
                <path
                  d="M200.418 121.5V77.852H276.322V88.348H210.914V121.5H200.418ZM200.418 44.7H288.482V55.196H200.418V44.7ZM312.758 44.7H323.254V121.5H312.758V44.7ZM347.598 44.7H363.726L429.902 112.156V44.7H440.398V121.5H424.398L358.094 54.044V121.5H347.598V44.7ZM569.904 121.5H501.424L508.08 111.004H562.608L523.696 54.556L477.488 121.5H464.688L517.808 44.7H529.712L582.704 121.5H569.904ZM607.027 44.7H623.155L689.331 112.156V44.7H699.827V121.5H683.827L617.523 54.044V121.5H607.027V44.7ZM724.118 93.34V72.86C724.118 65.0947 726.848 58.4813 732.31 53.02C737.856 47.4733 744.512 44.7 752.278 44.7H760.726H769.302H774.55H784.662H794.774C799.552 44.7 803.99 45.852 808.086 48.156C812.267 50.3747 815.638 53.4467 818.198 57.372C820.843 61.212 822.379 65.4787 822.806 70.172H812.182C811.499 65.9053 809.494 62.364 806.166 59.548C802.923 56.6467 799.126 55.196 794.774 55.196H784.662H774.55H769.302H760.726H752.278C749.12 55.196 746.176 56.0067 743.446 57.628C740.715 59.164 738.539 61.2973 736.918 64.028C735.382 66.7587 734.614 69.7027 734.614 72.86V93.34C734.614 98.204 736.32 102.385 739.734 105.884C743.232 109.297 747.414 111.004 752.278 111.004H760.726H769.302H774.55H784.662H794.774C799.126 111.004 802.923 109.596 806.166 106.78C809.494 103.879 811.499 100.295 812.182 96.028H822.806C822.123 103.196 819.094 109.255 813.718 114.204C808.342 119.068 802.027 121.5 794.774 121.5H784.662H774.55H769.302H760.726H752.278C744.512 121.5 737.856 118.769 732.31 113.308C726.848 107.761 724.118 101.105 724.118 93.34ZM847.083 111.004H935.147V121.5H847.083V111.004ZM847.083 77.852H922.987V88.348H847.083V77.852ZM847.083 44.7H935.147V55.196H847.083V44.7Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h3 className="text-sm font-medium text-black dark:text-white mt-6">
              Leveraged Decentralized Exchange
            </h3>
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Launch your project on Xchange with 10-1000x the initial liquidity
              into the Ethereum ecosystem where anyone can Swap, Borrow and
              Lend!
            </p>
            <ModeToggle />
          </div>
        </div>
        <div className="mt-8 border-t dark:border-gray-800 border-gray-200 pt-8 flex-col md:flex md:items-center md:justify-between">
          <div className="mt-8 text-sm text-gray-700 dark:text-gray-400 md:order-1 md:mt-0 flex flex-col md:flex-row w-full">
            <div className="flex flex-col items-center md:items-start md:flex-row">
              <span className="font-bold text-black dark:text-white">
                X7 Finance
              </span>
              <span className="mx-1 hidden md:block">·</span>
              <span>Trust No One. Trust Code. Long Live DeFi.</span>
            </div>
            <span className="mx-auto md:mr-0 md:ml-auto my-4 md:my-0">
              <ul className="flex justify-center items-center">
                {navigation.socials.map((item) => (
                  <li key={`footer-${item.name}`} className="px-1.5">
                    <Link
                      href={item.href}
                      rel={"noopener noreferrer"}
                      target={"_blank"}
                      className="text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:text-gray-900"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon
                        className="h-6 w-6 fill-gray-700"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
