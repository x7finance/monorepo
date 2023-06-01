import { cn } from "utils"
import { X7Logo } from "icons"

import Link from "next/link"

import { MobileNavigation } from "./mobile-navigation"
import { MobileSearch, Search } from "./search-dialog"

const tabs = [
  { name: "Marketplace", href: "/marketplace", current: false },
  { name: "Documentation", href: "/docs", current: false },
  { name: "Contracts", href: "/dashboard/contracts", current: true },
  { name: "Loans", href: "/dashboard/loans", current: false },
  { name: "DAO", href: "/dashboard/dao", current: false },
]

export function DashboardHeader() {
  return (
    <>
      <nav className="sticky z-10 w-full h-14">
        <div className="fixed px-3 py-3 lg:px-5 lg:pl-3 dark:bg-black bg-white">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "fixed inset-x-0 top-0 flex h-14 items-center justify-between gap-12 px-4 transition lg:left-20 lg:z-30 dark:bg-black bg-white"
              )}
            >
              <div className="flex lg:hidden">
                <Link href="/">
                  <LogoMark />
                </Link>
              </div>
              <Search />
              <div className="flex items-center gap-2 lg:hidden" />
              <div className="flex items-center gap-5">
                <nav className="hidden lg:block">
                  <ul role="list" className="flex items-center gap-8">
                    <li>
                      <Link
                        href={""}
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        Support
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={""}
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        XChange
                      </Link>
                    </li>
                  </ul>
                </nav>
                <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
                <div className="flex gap-4">
                  {/* TODO: put sweet Xchange button here */}
                  <MobileSearch />
                </div>
                <div className="hidden min-[416px]:contents">
                  <div className="w-24" />
                  {/* <Button size={"sm"}>
                    <span className="whitespace-nowrap">Connect Wallet </span>
                  </Button> */}
                </div>
                <MobileNavigation className="sm:hidden" />
              </div>
            </div>
            <LogoMark />
          </div>
        </div>
      </nav>

      <div className="fixed w-full z-0 dark:bg-black bg-white">
        <div className="mx-3 sm:hidden pb-2">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-zinc-300 py-2 pl-2 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-zinc-800 bg-zinc-200"
            // @ts-expect-error
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block mt-3">
          <div className="nav-shadow px-6">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    tab.current
                      ? "dark:border-white dark:text-white text-black border-black"
                      : "border-transparent dark:text-zinc-400/80 text-zinc-600/80 dark:hover:border-zinc-300 hover:border-black",
                    "whitespace-nowrap border-b-2 relative inline-block text-sm transition-colors duration-200 ease-in-out cursor-pointer px-3 dark:hover:bg-zinc-800 hover:bg-zinc-200 dark:hover:text-white hover:text-black py-2 rounded-t-md"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

function LogoMark() {
  return (
    <div className="flex items-center">
      <div className="flex items-center ml-3">
        <X7Logo className="h-8 mr-3 fill-black dark:fill-white" />
      </div>
    </div>
  )
}
