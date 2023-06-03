import { cn } from "utils"
import { X7Logo } from "icons"

import Link from "next/link"
import { X7LinksEnum } from "@/../../packages/common/dist"

import { CommunityLinks } from "@/lib/types/links"

import { DashboardTabNavigation } from "./dashboard-tab-nav"
import { MobileNavigation } from "./mobile-navigation"
import { Search } from "./search-dialog"

export function DashboardHeader() {
  return (
    <>
      <nav className="sticky z-10 w-full h-14">
        <div className="fixed px-3 py-3 lg:px-5 lg:pl-3 dark:bg-black bg-white">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "fixed inset-x-0 top-0 flex h-14 items-center justify-between sm:justify-normal md:justify-between lg:gap-12 gap-4 px-4 transition lg:left-20 lg:z-30 dark:bg-black bg-white"
              )}
            >
              <div className="flex lg:hidden">
                <LogoMarkLink />
              </div>
              <Search />
              <div className="flex items-center gap-2 lg:hidden" />
              <div className="flex md:items-center gap-0 md:gap-5 ">
                <nav className="hidden md:block">
                  <ul role="list" className="flex items-center gap-8">
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
                        href={X7LinksEnum.XChange}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        XChange
                      </Link>
                    </li>
                  </ul>
                </nav>
                <div className="hidden lg:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
                <div className="hidden md:block w-32" />
                <div className="flex sm:hidden mr-6">
                  <Search isMobile={true} />
                </div>
                <MobileNavigation className="sm:hidden" />
              </div>
            </div>
            <LogoMarkLink />
          </div>
        </div>
      </nav>

      <div className="fixed w-full z-10 dark:bg-black bg-white">
        <DashboardTabNavigation />
      </div>
    </>
  )
}

function LogoMarkLink() {
  return (
    <div className="flex items-center">
      <div className="flex items-center ml-3">
        <Link href="/">
          <X7Logo className="h-8 mr-3 fill-black dark:fill-white" />
        </Link>
      </div>
    </div>
  )
}
