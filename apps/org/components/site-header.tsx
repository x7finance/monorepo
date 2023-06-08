import { X7LinksEnum } from "common"
import { cn } from "utils"
import { X7LongLogo, Xchange } from "icons"

import Link from "next/link"

import {
  DashboardLinksEnum,
  DocsLinks,
  LoansLinksEnum,
  MarketingLinks,
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
              {navLinks.map((link, key) => (
                <li
                  key={`nav-item-${key}`}
                  className="flex items-center align-center"
                >
                  <Link
                    className="outline-none whitespace-nowrap rounded-full px-2 py-3 text-sm cursor-pointer text-zinc-800 hover:text-black dark:text-zinc-200 hover:dark:text-white"
                    {...(link.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    href={link.href}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
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
              href={X7LinksEnum.Xchange}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "hidden lg:block py-1.5"
              )}
            >
              <Xchange className="w-24" />
            </Link>

            <MobileNavigation className="lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  )
}

const navLinks = [
  { title: "Get Started", href: MarketingLinks.GetStarted },
  { title: "Tokens", href: TokenLinksEnum.Index },
  { title: "Docs", href: DocsLinks.Index },
  {
    title: "Marketplace",
    href: DashboardLinksEnum.Marketplace,
  },
  { title: "Loans", href: LoansLinksEnum.Index },
  { title: "DAO", href: DashboardLinksEnum.DAO },
  { title: "Trade", href: X7LinksEnum.Xchange, isExternal: true },
]
