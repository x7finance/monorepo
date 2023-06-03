import { cn } from "utils"
import { X7LongLogo, XChange } from "icons"

import Link from "next/link"
import { X7LinksEnum } from "@/../../packages/common/dist"

import {
  DashboardLinksEnum,
  DocsLinks,
  ProductsLinkEnum,
  TokenLinksEnum,
} from "@/lib/types/links"
import { buttonVariants } from "@/components/ui/button"

import { MobileNavigation } from "./mobile-navigation"

export function SiteHeader({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header className={className}>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full">
          <Link href="/">
            <X7LongLogo className="dark:text-white w-48 text-black" />
          </Link>
        </div>
      </div>
      <div className="flex-1 lg:flex justify-center items-center m-0 w-full hidden">
        <nav
          aria-label="Navigation header with 7 links"
          data-orientation="horizontal"
          dir="ltr"
          className="w-full justify-center flex relative items-center"
        >
          <div className="relative">
            <ul
              data-orientation="horizontal"
              className="flex gap-2 grid-gap-2 list-none m-0 p-0"
              dir="ltr"
            >
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-white"
                  href={ProductsLinkEnum.Index}
                >
                  Products
                </Link>
              </li>
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href={DocsLinks.Index}
                >
                  Docs
                </Link>
              </li>
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href={DocsLinks.Templates}
                >
                  Examples
                </Link>
              </li>
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href={DashboardLinksEnum.Marketplace}
                >
                  Marketplace
                </Link>
              </li>
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href={TokenLinksEnum.Index}
                >
                  Tokens
                </Link>
              </li>
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href={DashboardLinksEnum.DAO}
                >
                  DAO
                </Link>
              </li>
              <li className="flex items-center align-center">
                <Link
                  className="outline-none rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                  href={X7LinksEnum.XChange}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Trade
                </Link>
              </li>
            </ul>
          </div>
          <div
            className="absolute flex justify-center top-full left-0"
            style={{ perspective: "2000px" }}
          />
        </nav>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="ml-auto">
          <div className="flex items-center text-sm w-full gap-2">
            <Link
              href={X7LinksEnum.XChange}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "hidden lg:block py-1.5"
              )}
            >
              <XChange className="w-24" />
            </Link>

            <MobileNavigation className="lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  )
}