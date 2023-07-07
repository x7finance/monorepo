"use client"

import Link from "next/link"
import { Popover } from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"

import { X7LinksEnum } from "@x7/common"
import { ChevronUpIcon, MenuIcon, X7Logo } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { cn } from "@x7/utils"

import { MOBILE_NAV_LINKS } from "@/config/site"
import { DocsLinks } from "@/lib/types/links"
import { ModeToggle } from "./mode-toggle"

function MobileNavLink({
  children,
  ...props
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-zinc-700 dark:text-zinc-300"
      {...props}
    >
      {children}
    </Popover.Button>
  )
}

export function MobileNavigation({ className }: { className: string }) {
  return (
    <Popover className={className}>
      {({ open }) => (
        <>
          <Popover.Button
            className="relative top-1 z-40 -m-2 inline-flex items-center rounded-lg border border-zinc-600 stroke-zinc-900 p-2 text-black hover:bg-zinc-200/50 hover:stroke-zinc-600 active:stroke-zinc-900 dark:stroke-zinc-100 dark:text-white dark:hover:bg-zinc-800/50 dark:hover:stroke-zinc-500 dark:active:stroke-zinc-100 [&:not(:focus-visible)]:focus:outline-none"
            aria-label="Toggle site navigation"
          >
            {({ open }) =>
              open ? (
                <ChevronUpIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )
            }
          </Popover.Button>
          <AnimatePresence initial={false}>
            {open && (
              <>
                <Popover.Overlay
                  static
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-0 bg-zinc-300/60 backdrop-blur dark:bg-zinc-700/60"
                />
                <Popover.Panel
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: -32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -32,
                    transition: { duration: 0.2 },
                  }}
                  className="absolute inset-x-0 top-0 z-30 origin-top rounded-b-2xl bg-zinc-50 px-6 pb-6 pt-4 shadow-2xl shadow-zinc-900/20 dark:bg-zinc-900 dark:shadow-zinc-50/20"
                >
                  <div className="mb-8 flex items-center">
                    <X7Logo className="h-8 w-auto fill-black dark:fill-white" />
                  </div>
                  <div className="space-y-4">
                    {MOBILE_NAV_LINKS.map((link, key) => (
                      <MobileNavLink key={`mobile-nav-${key}`} href={link.href}>
                        {link.name}
                      </MobileNavLink>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-4 text-black dark:text-white">
                    <ModeToggle />
                    <div className="text-center text-xs italic text-zinc-500">
                      Trust No One. Trust Code. Long Live DeFi
                    </div>
                    <Link
                      href={DocsLinks.Index}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                        })
                      )}
                    >
                      Read Docs
                    </Link>
                    <Link
                      href={X7LinksEnum.Xchange}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "default",
                        })
                      )}
                    >
                      Go To Xchange
                    </Link>
                  </div>
                </Popover.Panel>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  )
}
