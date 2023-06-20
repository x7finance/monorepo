"use client"

import { cn } from "utils"

import { ReactNode, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SectionNavigation } from "./section-navigation"

type NavLinkProps = {
  href: string
  isActive: boolean
  children: ReactNode
}

type NavigationProps = {
  navigation: Array<{
    title: string
    links: Array<{
      href: string
      title: string
    }>
  }>
  className?: string
}

export function Navigation({ navigation, className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("text-base lg:text-sm", className)}>
      <SectionNavigation className="space-y-1 mb-6" />
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-zinc-900 dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-zinc-100 dark:border-zinc-800 lg:mt-4 lg:space-y-4 lg:border-zinc-200"
            >
              {section.links.map((link) => (
                <li key={link.href} className="relative">
                  <NavLink href={link.href} isActive={link.href === pathname}>
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
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
    <Link
      ref={ref}
      className={cn(
        isActive ? "before:bg-sky-500" : "",
        "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 dark:text-zinc-400 before:w-1.5 before:-translate-y-1/2 before:rounded-full"
      )}
      href={href}
    >
      <span
        className={cn(
          isActive
            ? "bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text font-semibold text-transparent"
            : "text-zinc-500 before:hidden before:bg-zinc-300 hover:text-zinc-600 hover:before:block dark:text-zinc-400 dark:before:bg-zinc-700 dark:hover:text-zinc-300"
        )}
      >
        {children}
      </span>
    </Link>
  )
}
