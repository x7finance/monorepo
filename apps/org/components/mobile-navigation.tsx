"use client"

import { X7Logo } from "icons"

import Link from "next/link"
import { cn } from "@/../../packages/utils/dist"
import { Popover } from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"

import { ModeToggle } from "./mode-toggle"
import { buttonVariants } from "./ui/button"

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
            className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-zinc-900 border-zinc-600 border dark:stroke-zinc-100 p-2 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:stroke-zinc-600 dark:hover:stroke-zinc-500 active:stroke-zinc-900 dark:active:stroke-zinc-100 [&:not(:focus-visible)]:focus:outline-none"
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
                  className="absolute inset-x-0 top-0 origin-top rounded-b-2xl bg-zinc-50 dark:bg-zinc-900 px-6 pb-6 pt-4 shadow-2xl shadow-zinc-900/20 dark:shadow-zinc-50/20"
                >
                  <div className="flex mb-8 items-center">
                    <X7Logo className="h-8 w-auto fill-black dark:fill-white" />
                    <div className="text-xs text-zinc-500 italic">
                      Trust No One. Trust Code. Long Live DeFi
                    </div>
                  </div>
                  <div className="space-y-4">
                    <MobileNavLink href="/products">Products</MobileNavLink>
                    <MobileNavLink href="/marketplace">
                      Marketplace
                    </MobileNavLink>
                    <MobileNavLink href="/tokens">Tokens</MobileNavLink>
                    <MobileNavLink href="/dao">DAO</MobileNavLink>
                  </div>
                  <div className="mt-8 flex flex-col gap-4 text-black dark:text-white">
                    <ModeToggle />
                    <Link
                      href="/docs"
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                        })
                      )}
                    >
                      Read Docs
                    </Link>
                    <Link
                      href="https://beta.x7.finance/#/swap"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({
                          variant: "default",
                        })
                      )}
                    >
                      Go To XChange
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

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
