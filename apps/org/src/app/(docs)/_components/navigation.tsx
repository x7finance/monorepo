"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@x7/css"
import { ChevronDownIcon } from "@x7/icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@x7/ui/collapsible"
import { LinkInternal } from "@x7/ui/link"

import { SectionNavigation } from "./section-navigation"

interface NavLinkProps {
  href: string
  isActive: boolean
  children: ReactNode
}

interface NavigationProps {
  navigation: {
    title: string
    links: {
      href: string
      title: string
    }[]
  }[]
  className?: string
}

export function Navigation({ navigation, className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Documentation navigation"
      className={cn("text-base lg:text-sm", className)}
    >
      <SectionNavigation className="mb-6 space-y-1" />
      <ul className="space-y-9">
        {navigation.map((section) =>
          navigation.length > 1 ? (
            <CollapsibleDocsSection
              pathname={pathname}
              key={section.title}
              section={section}
            />
          ) : (
            <li key={section.title}>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href} className="relative mb-2">
                    <NavLink href={link.href} isActive={link.href === pathname}>
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}

function CollapsibleDocsSection(props: {
  section: NavigationProps["navigation"][0]
  pathname: string
}) {
  const { section, pathname } = props
  const [open, setOpen] = useState(true)

  return (
    <li className="flex items-center">
      <Collapsible
        key={section.title}
        className="w-[350px] space-y-2"
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <h4 className="font-display font-medium text-zinc-900 dark:text-white">
            {section.title}
          </h4>
          <div className="pointer-events-auto ml-4 flex-none rounded-lg px-2 py-[0.3125rem] font-medium text-zinc-700 shadow-xs ring-1 ring-zinc-700/10 dark:text-zinc-400 dark:ring-zinc-700/50 dark:group-hover:bg-black dark:group-hover:text-white">
            <ChevronDownIcon
              className={`h-4 w-4 transform transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
            />
            <span className="sr-only">Toggle</span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-2 space-y-2 border-l-2 border-zinc-100 lg:mt-4 lg:space-y-4 lg:border-zinc-200 dark:border-zinc-800">
            {section.links.map((link) => (
              <li key={link.href} className="relative">
                <NavLink href={link.href} isActive={link.href === pathname}>
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        block: "center",
      })
    }
  }, [isActive])

  return (
    <LinkInternal
      prefetch={true}
      ref={ref}
      className={cn(
        isActive ? "before:bg-sky-500" : "",
        "block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full dark:text-zinc-400"
      )}
      href={href}
    >
      <span
        className={cn(
          isActive
            ? "bg-linear-to-r from-sky-500 to-violet-500 bg-clip-text font-semibold text-transparent"
            : "text-zinc-500 before:hidden before:bg-zinc-300 hover:text-zinc-600 hover:before:block dark:text-zinc-400 dark:before:bg-zinc-700 dark:hover:text-zinc-300"
        )}
      >
        {children}
      </span>
    </LinkInternal>
  )
}
