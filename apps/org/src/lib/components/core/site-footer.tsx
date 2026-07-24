import type { HTMLAttributes } from "react"

import { X7LongLogo } from "@x7/icons"
import { LinkExternal, LinkInternal } from "@x7/ui/link"
import { FOOTER_NAVIGATION } from "~/lib/config/site"
import { CommunityLinks, TokenLinksEnum, XchangeLinks } from "~/types/links"

export function SiteFooter({ className }: HTMLAttributes<HTMLElement>) {
  return (
    <footer className={className} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">
                  <LinkInternal
                    prefetch={true}
                    href={XchangeLinks.Swap}
                    className="font-semibold text-zinc-900 hover:text-black dark:text-zinc-100 dark:hover:text-white"
                  >
                    Xchange
                  </LinkInternal>
                </h3>
                <ul className="mt-4 space-y-4">
                  {FOOTER_NAVIGATION.xchange.map((item) => (
                    <li key={item.name}>
                      <LinkInternal
                        prefetch={true}
                        href={item.href}
                        className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
                      >
                        {item.name}
                      </LinkInternal>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-medium text-black dark:text-white">
                  <LinkInternal
                    href={TokenLinksEnum.Index}
                    className="font-semibold text-zinc-900 hover:text-black dark:text-zinc-100 dark:hover:text-white"
                  >
                    Tokens
                  </LinkInternal>
                </h3>
                <ul className="mt-4 space-y-4">
                  {FOOTER_NAVIGATION.tokens.map((item, index) => (
                    <li key={item.name}>
                      <LinkInternal
                        prefetch={true}
                        href={item.href}
                        className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
                      >
                        {item.name}
                      </LinkInternal>
                      {index === FOOTER_NAVIGATION.explore.length - 1 && (
                        <div className="mb-4"></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">
                  <LinkInternal
                    prefetch={true}
                    href={XchangeLinks.About}
                    className="font-semibold text-zinc-900 hover:text-black dark:text-zinc-100 dark:hover:text-white"
                  >
                    Explore
                  </LinkInternal>
                </h3>
                <ul className="mt-4 space-y-4">
                  {FOOTER_NAVIGATION.explore.map((item, index) => (
                    <li key={item.name}>
                      <LinkInternal
                        prefetch={true}
                        href={item.href}
                        className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
                      >
                        {item.name}
                      </LinkInternal>
                      {index === FOOTER_NAVIGATION.explore.length - 1 && (
                        <div className="mb-8"></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">
                  <LinkInternal
                    prefetch={true}
                    href={CommunityLinks.Index}
                    className="font-semibold text-zinc-900 hover:text-black dark:text-zinc-100 dark:hover:text-white"
                  >
                    Community
                  </LinkInternal>
                </h3>
                <ul className="mt-4 space-y-4">
                  {FOOTER_NAVIGATION.community.map((item) => (
                    <li key={item.name}>
                      <LinkInternal
                        prefetch={true}
                        target="_blank"
                        rel="noreferrer noopener"
                        href={item.href}
                        className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
                      >
                        {item.name}
                      </LinkInternal>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 xl:mt-0">
            <span>
              <X7LongLogo className="w-1/2 fill-black md:w-1/4 xl:w-3/4 dark:fill-white" />
            </span>
            <h3 className="mt-6 text-sm font-medium text-black dark:text-white">
              Permissionless Trustless Decentralized Exchange
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              Launch your project on Xchange with 10-1000x the initial liquidity
              across multiple blockchains where anyone can Swap, Borrow and
              Lend!
            </p>
          </div>
        </div>
        <div className="border-border mt-8 flex-col border-t pt-8 md:flex md:items-center md:justify-between">
          <div className="text-secondary-foreground mt-8 flex w-full flex-col text-sm md:order-1 md:mt-0 md:flex-row">
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <span className="font-bold text-black dark:text-white">
                X7 Finance
              </span>
              <span className="mx-1 hidden md:block">·</span>
              <span>Trust No One. Trust Code. Long Live DeFi.</span>
            </div>
            <span className="mx-auto my-4 md:my-0 md:mr-0 md:ml-auto">
              <ul className="flex items-center justify-center">
                {FOOTER_NAVIGATION.socials.map((item) => (
                  <li key={`footer-${item.name}`} className="px-1.5">
                    <LinkExternal
                      href={item.href}
                      rel={"noopener noreferrer"}
                      target={"_blank"}
                      className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon
                        className="h-6 w-6 fill-zinc-700"
                        aria-hidden="true"
                      />
                    </LinkExternal>
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
