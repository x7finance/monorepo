import { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from 'utils'
import { motion, useScroll, useTransform } from 'framer-motion'

import { Button } from 'ui'
import { X7Logo } from 'icons'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from './MobileNavigation'
import { useMobileNavigationStore } from './MobileNavigation'
import { ModeToggle } from './ModeToggle'
import { MobileSearch, Search } from './Search'

function TopLevelNavItem({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }: any, ref: any) {
  // @ts-expect-error
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <motion.div
      ref={ref}
      className={cn(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
        !isInsideMobileNavigation &&
          'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]'
      )}
      style={{
        // @ts-expect-error
        '--bg-opacity-light': bgOpacityLight,
        '--bg-opacity-dark': bgOpacityDark,
      }}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-full h-px transition',
          (isInsideMobileNavigation || !mobileNavIsOpen) &&
            'bg-zinc-900/7.5 dark:bg-white/7.5'
        )}
      />
      <Search />
      <div className="flex items-center gap-5 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home">
          <X7Logo
            className={cn(
              'h-5 w-5  stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900  dark:stroke-zinc-400 dark:group-hover:fill-sky-300/10 dark:group-hover:stroke-sky-400'
            )}
          />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            <TopLevelNavItem href="/">API</TopLevelNavItem>
            <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
            <TopLevelNavItem href="#">Support</TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
        <div className="flex gap-4">
          <MobileSearch />
          <ModeToggle />
        </div>
        <div className="hidden min-[416px]:contents">
          <Button>Sign in</Button>
        </div>
      </div>
    </motion.div>
  )
})
