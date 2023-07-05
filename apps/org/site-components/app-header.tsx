import Link from "next/link"

import { X7LinksEnum } from "@x7/common"
import { X7Logo } from "@x7/icons"
import { cn } from "@x7/utils"

import { CommunityLinks } from "@/lib/types/links"
import { AppTabNavigation } from "./app-tab-nav"
import { MobileNavigation } from "./mobile-navigation"
import { Search } from "./search-dialog"

export function AppHeader() {
  return (
    <>
      <nav className="sticky z-10 h-14 w-full">
        <div className="fixed bg-white px-3 py-3 dark:bg-black lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "fixed inset-x-0 top-0 flex h-14 items-center justify-between gap-4 bg-white px-4 transition dark:bg-black sm:justify-normal md:justify-between lg:left-20 lg:z-30 lg:gap-12"
              )}
            >
              <div className="flex lg:hidden">
                <LogoMarkLink />
              </div>
              <Search />
              <div className="flex items-center gap-2 lg:hidden" />
              <div className="flex gap-0 md:items-center md:gap-5 ">
                <nav className="hidden md:block">
                  <ul className="flex items-center gap-8">
                    <li>
                      <Link
                        href={CommunityLinks.Support}
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={X7LinksEnum.Xchange}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        Xchange
                      </Link>
                    </li>
                  </ul>
                </nav>
                <div className="hidden md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15 lg:block" />
                <div className="hidden w-32 md:block" />
                <div className="mr-6 flex sm:hidden">
                  <Search isMobile={true} />
                </div>
                <MobileNavigation className="sm:hidden" />
              </div>
            </div>
            <LogoMarkLink />
          </div>
        </div>
      </nav>

      <div className="z-10 w-full bg-white dark:bg-black sm:fixed">
        <AppTabNavigation />
      </div>
    </>
  )
}

function LogoMarkLink() {
  return (
    <div className="flex items-center">
      <div className="ml-3 flex items-center">
        <Link href="/">
          <X7Logo className="mr-3 h-8 fill-black dark:fill-white" />
        </Link>
      </div>
    </div>
  )
}
