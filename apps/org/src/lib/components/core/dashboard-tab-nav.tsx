"use client"

import { usePathname } from "next/navigation"

import { cn } from "@x7/css"
import { LinkInternal } from "@x7/ui/link"
import { DASHBOARD_TABS_NAV } from "~/lib/config/site"
import { DashboardLinksEnum } from "~/types/links"

export function DashboardTabNavigation() {
  const pathname = usePathname()

  return (
    <div>
      <div className="nav-shadow border-b border-zinc-100/50 sm:border-0 sm:px-6 dark:border-zinc-900/50">
        <nav className="-mb-px flex" aria-label="Tabs">
          {DASHBOARD_TABS_NAV.map((tab) => {
            return (
              <LinkInternal
                prefetch={true}
                key={tab.name}
                href={tab.href}
                className={cn(
                  isActive(pathname, tab.href)
                    ? "border-black text-black dark:border-white dark:text-white"
                    : "border-transparent text-zinc-600/80 hover:border-black dark:text-zinc-400/80 dark:hover:border-zinc-300",
                  "relative inline-block cursor-pointer rounded-t-md border-b-2 px-2 py-2 text-sm whitespace-nowrap transition-colors duration-200 ease-in-out hover:bg-zinc-100 hover:text-black sm:px-3 dark:hover:bg-zinc-800 dark:hover:text-white"
                )}
                aria-current={isActive(pathname, tab.href) ? "page" : undefined}
              >
                {tab.name}
              </LinkInternal>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function isActive(pathname: string, href: string): boolean {
  if (href === DashboardLinksEnum.Index.toString()) {
    return pathname === href
  }

  return pathname.startsWith(href)
}
