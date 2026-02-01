import React from "react"

import { cn } from "@x7/css"
import { TextIcon, X7LongLogo, XIcon } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { LinkInternal } from "@x7/ui/link"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@x7/ui/sheet"
import { MOBILE_NAV_LINKS } from "~/lib/config/site"
import { DocsLinks } from "~/types/links"

import { ThemeToggle } from "../utils/theme-toggle"

export function MobileNavigation({ className }: { className?: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            "relative z-40 -m-2 inline-flex items-center rounded-lg border border-zinc-600 stroke-zinc-900 p-1 text-black hover:bg-zinc-200/50 hover:stroke-zinc-600 focus-visible:outline-emerald-500 active:stroke-zinc-900 sm:p-2 dark:stroke-zinc-100 dark:text-white dark:hover:bg-zinc-800/50 dark:hover:stroke-zinc-500 dark:active:stroke-zinc-100",
            className
          )}
        >
          <TextIcon data-slot="icon" className="h-6 w-6 rotate-180" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-80 p-0 lg:hidden">
        <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <SheetHeader className="-mb-3 ml-auto px-4 pt-3">
            <SheetClose className="ml-auto">
              <XIcon data-slot="icon" className="h-6 w-6" />
            </SheetClose>
          </SheetHeader>
          <div className="mb-8 flex items-center px-4 pt-4">
            <X7LongLogo className="w-36 text-black dark:text-white" />
          </div>
          <div className="space-y-4 px-4">
            {MOBILE_NAV_LINKS.map((link, key) => (
              <SheetClose asChild key={`mobile-nav-${key}`}>
                <LinkInternal
                  prefetch={true}
                  href={link.href}
                  className="block text-base leading-7 tracking-tight text-zinc-700 dark:text-zinc-300"
                >
                  {link.name}
                </LinkInternal>
              </SheetClose>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 px-4 text-black dark:text-white">
            <ThemeToggle />
            <div className="text-center text-xs text-zinc-500 italic">
              Trust No One. Trust Code. Long Live DeFi
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 px-4">
            <SheetClose asChild>
              <LinkInternal
                prefetch={true}
                href={DocsLinks.Index}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "text-black dark:text-white"
                )}
              >
                Read Docs
              </LinkInternal>
            </SheetClose>
            <SheetClose asChild>
              <LinkInternal
                prefetch={true}
                href={"/"}
                className={cn(
                  buttonVariants({
                    variant: "default",
                  })
                )}
              >
                Go To Xchange &rarr;
              </LinkInternal>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
