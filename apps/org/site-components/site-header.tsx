import type { HTMLAttributes } from "react"
import Link from "next/link"

// import { useTranslations } from "next-intl"

import { X7LinksEnum } from "@x7/common"
import { X7LongLogo, Xchange } from "@x7/icons"
// @ts-expect-error todo: fix this
import { buttonVariants } from "@x7/ui/button"
import { cn } from "@x7/utils"

import { DESKTOP_NAV_LINKS } from "@/config/site"
import { MobileNavigation } from "./mobile-navigation"

export function SiteHeader({ className }: HTMLAttributes<HTMLElement>) {
  // const t = useTranslations("Navigation")

  return (
    <header className={className}>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full">
          <Link href="/">
            <X7LongLogo className="w-48 text-black dark:text-white" />
          </Link>
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
              {DESKTOP_NAV_LINKS.map((link, key) => (
                <li
                  key={`nav-item-${key}`}
                  className="align-center flex items-center"
                >
                  <Link
                    className="cursor-pointer whitespace-nowrap rounded-full px-2 py-3 text-sm text-zinc-800 outline-none hover:text-black dark:text-zinc-200 hover:dark:text-white"
                    {...(link.isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    href={link.href}
                  >
                    {link.name}
                    {/* {t(link.name.toLowerCase())} */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="absolute left-0 top-full flex justify-center"
            style={{ perspective: "2000px" }}
          />
        </nav>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="ml-auto">
          <div className="flex w-full items-center gap-2 text-sm">
            <Link
              href={X7LinksEnum.Xchange}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "hidden py-1.5 lg:block"
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
