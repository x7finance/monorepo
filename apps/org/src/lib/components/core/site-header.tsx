import type { HTMLAttributes } from "react"

import { cn } from "@x7/css"
import { X7LongLogo, Xchange } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { LinkInternal } from "@x7/ui/link"
import { DESKTOP_NAV_LINKS } from "~/lib/config/site"

import { ClientMobileNavigation } from "./client-mobile-nav"

export function SiteHeader({ className }: HTMLAttributes<HTMLElement>) {
  return (
    <header className={className}>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full">
          <LinkInternal prefetch={true} href="/">
            <X7LongLogo className="w-48 text-black dark:text-white" />
          </LinkInternal>
        </div>
      </div>
      <div className="m-0 hidden w-full flex-1 items-center justify-center lg:flex">
        <nav
          aria-label="Navigation header with 7 links"
          data-orientation="horizontal"
          dir="ltr"
          className="relative flex w-full items-center justify-center"
        >
          <div className="relative">
            <ul
              data-orientation="horizontal"
              className="grid-gap-2 m-0 flex list-none gap-2 p-0"
              dir="ltr"
            >
              {DESKTOP_NAV_LINKS.map((link) => (
                <li key={link.href} className="align-center flex items-center">
                  <LinkInternal
                    prefetch={true}
                    className="cursor-pointer rounded-full px-2 py-3 text-sm whitespace-nowrap text-zinc-800 outline-hidden hover:text-black dark:text-zinc-200 dark:hover:text-white"
                    href={link.href}
                  >
                    {link.name}
                  </LinkInternal>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="absolute top-full left-0 flex justify-center"
            style={{ perspective: "2000px" }}
          />
        </nav>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="ml-auto">
          <div className="flex w-full items-center gap-2 text-sm">
            <LinkInternal
              prefetch={true}
              href="/"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "hidden py-1.5 lg:block"
              )}
            >
              <Xchange className="w-24" />
            </LinkInternal>

            <ClientMobileNavigation className="lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  )
}
