import { X7LongLogo } from "icons"

import { HTMLAttributes } from "react"
import Link from "next/link"

import { FOOTER_NAVIGATION } from "@/config/site"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteFooter({ className }: HTMLAttributes<HTMLElement>) {
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
                  {FOOTER_NAVIGATION.product.map((item) => (
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
                  {FOOTER_NAVIGATION.explore.map((item) => (
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
                  {FOOTER_NAVIGATION.marketplace.map((item) => (
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
                  {FOOTER_NAVIGATION.community.map((item) => (
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
            <span>
              <X7LongLogo className="w-1/2 md:w-1/4 xl:w-3/4 fill-black dark:fill-white" />
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
                {FOOTER_NAVIGATION.socials.map((item) => (
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
