"use client"

import { cn } from "utils"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { DASHBOARD_TABS_NAV } from "@/config/site"
import { DashboardLinksEnum } from "@/lib/types/links"

export function AppTabNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <div className="mx-3 sm:hidden pb-2 relative tab-nav-select">
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
          className="block rounded-md border border-zinc-400 dark:border-zinc-600 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-zinc-800 bg-zinc-200 h-12 text-base leading-7 w-full mx-0 my-1 px-6 py-0 font-semibold appearance-none"
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
      <div className="hidden sm:block mt-3">
        <div className="nav-shadow px-6">
          <nav className="-mb-px flex" aria-label="Tabs">
            {DASHBOARD_TABS_NAV.map((tab) => {
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={cn(
                    isActive(pathname, tab.href)
                      ? "dark:border-white dark:text-white text-black border-black"
                      : "border-transparent dark:text-zinc-400/80 text-zinc-600/80 dark:hover:border-zinc-300 hover:border-black",
                    "whitespace-nowrap border-b-2 relative inline-block text-sm transition-colors duration-200 ease-in-out cursor-pointer px-3 dark:hover:bg-zinc-800 hover:bg-zinc-100 dark:hover:text-white hover:text-black py-2 rounded-t-md"
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

function isActive(pathname, href) {
  if (href === DashboardLinksEnum.Index) {
    return pathname === href
  }

  return pathname.startsWith(href)
}
