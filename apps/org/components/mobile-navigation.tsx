"use client"

import { X7LinksEnum } from "common"
import { cn } from "utils"
import { buttonVariants } from "ui-server"
import { ChevronUpIcon, MenuIcon, X7Logo } from "icons"

import Link from "next/link"
import { Popover } from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"

import { MOBILE_NAV_LINKS } from "@/config/site"
import { DocsLinks } from "@/lib/types/links"

import { ModeToggle } from "./mode-toggle"

function MobileNavLink({ children, ...props }) {
  return (
    // @ts-ignore
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
            className="relative z-40 -m-2 top-1 inline-flex items-center rounded-lg text-black dark:text-white stroke-zinc-900 border-zinc-600 border dark:stroke-zinc-100 p-2 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:stroke-zinc-600 dark:hover:stroke-zinc-500 active:stroke-zinc-900 dark:active:stroke-zinc-100 [&:not(:focus-visible)]:focus:outline-none"
            aria-label="Toggle site navigation"
          >
            {({ open }) =>
              open ? (
                <ChevronUpIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
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
                  className="fixed inset-0 z-0 bg-zinc-300/60 dark:bg-zinc-700/60 backdrop-blur"
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
                  className="absolute inset-x-0 top-0 z-30 px-6 pt-4 pb-6 origin-top shadow-2xl rounded-b-2xl bg-zinc-50 dark:bg-zinc-900 shadow-zinc-900/20 dark:shadow-zinc-50/20"
                >
                  <div className="flex items-center mb-8">
                    <X7Logo className="w-auto h-8 fill-black dark:fill-white" />
                  </div>
                  <div className="space-y-4">
                    {MOBILE_NAV_LINKS.map((link, key) => (
                      <MobileNavLink key={`mobile-nav-${key}`} href={link.href}>
                        {link.name}
                      </MobileNavLink>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 mt-8 text-black dark:text-white">
                    <ModeToggle />
                    <div className="text-xs italic text-center text-zinc-500">
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
