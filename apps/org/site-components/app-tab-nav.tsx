"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@x7/utils"

import { DASHBOARD_TABS_NAV } from "@/config/site"
import { DashboardLinksEnum } from "@/lib/types/links"

export function AppTabNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <div className="tab-nav-select relative mx-3 pb-2 sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          onChange={(e) => {
            const link = DASHBOARD_TABS_NAV.find(
              (tab) => tab.name === e.target.value
            )?.href
            router.push(`${link}`)
          }}
          id="tabs"
          name="tabs"
          className="mx-0 my-1 block h-12 w-full appearance-none rounded-md border border-zinc-400 bg-zinc-200 px-6 py-0 pl-3 pr-10 text-base font-semibold leading-7 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 sm:text-sm"
          defaultValue={
            DASHBOARD_TABS_NAV.find((tab) => pathname.startsWith(tab.href))
              ?.name
          }
        >
          {DASHBOARD_TABS_NAV.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-1 hidden sm:block">
        <div className="nav-shadow px-6">
          <nav className="-mb-px flex" aria-label="Tabs">
            {DASHBOARD_TABS_NAV.map((tab) => {
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    isActive(pathname, tab.href)
                      ? "border-black text-black dark:border-white dark:text-white"
                      : "border-transparent text-zinc-600/80 hover:border-black dark:text-zinc-400/80 dark:hover:border-zinc-300",
                    "relative inline-block cursor-pointer whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors duration-200 ease-in-out hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                  )}
                  aria-current={
                    isActive(pathname, tab.href) ? "page" : undefined
                  }
                >
                  {tab.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

function isActive(pathname: string, href: string): boolean {
  if (href === DashboardLinksEnum.Index) {
    return pathname === href
  }

  return pathname.startsWith(href)
}
