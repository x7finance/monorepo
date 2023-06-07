"use client"

import { cn } from "utils"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { DocsLinks } from "@/lib/types/links"

const topNavigation = [
  {
    href: DocsLinks.Guides,
    title: "Guides",
    section: "guides",
    pioneerId: "1997",
  },
  {
    section: "integration",
    href: DocsLinks.Integrating,
    title: "Integration",
    pioneerId: "0137",
  },
  {
    section: "whitepaper",
    href: DocsLinks.Whitepaper,
    title: "Whitepaper",
    pioneerId: "0018",
  },
  {
    section: "onchains",
    href: DocsLinks.Onchains,
    title: "Onchains",
    pioneerId: "2773",
  },
  {
    section: "faq",
    href: DocsLinks.FAQ,
    title: "FAQ",
    pioneerId: "0170",
  },
]

function getSection(str) {
  const parts = str.split("/")

  if (parts.length >= 3) {
    return parts[2]
  } else {
    return null
  }
}

export function Navigation({ navigation, className, slug }: any) {
  const pathname = usePathname()
  const currentSection = getSection(pathname)

  return (
    <nav className={cn("text-base lg:text-sm", className)}>
      <ul role="list" className="space-y-1 mb-6">
        {topNavigation.map(
          (link: any) =>
            link.section !== currentSection && (
              <li key={link.href} className="relative">
                <Link href={link.href} className="group">
                  <div className="flex items-center px-0 py-1 pl-0.5">
                    <Image
                      alt={`Piooner ${link.pioneerId} avatar`}
                      height={200}
                      width={200}
                      src={`https://img.x7.finance/pioneers/${link.pioneerId}.png`}
                      className="h-10 w-10 flex-none rounded-full ring-zinc-400/20 ring-[2px]"
                    />
                    <div className="ml-4 flex-auto">
                      <div className="font-medium dark:text-zinc-300 text-zinc-700 group-hover:dark:text-white">
                        {link.title}
                      </div>
                    </div>
                    <div className="pointer-events-auto ml-4 flex-none rounded-md px-2 py-[0.3125rem] font-medium text-zinc-700 dark:text-zinc-400 shadow-sm ring-1 ring-zinc-700/10 dark:ring-zinc-700/50 dark:group-hover:text-white dark:group-hover:bg-black">
                      View
                    </div>
                  </div>
                </Link>
              </li>
            )
        )}
      </ul>
      <ul role="list" className="space-y-9">
        {navigation.map((section: any) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-zinc-900 dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-zinc-100 dark:border-zinc-800 lg:mt-4 lg:space-y-4 lg:border-zinc-200"
            >
              {section.links.map((link: any) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      link.href === pathname ? `before:bg-sky-500` : ``,
                      "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 dark:text-zinc-400 before:w-1.5 before:-tranzinc-y-1/2 before:rounded-full"
                    )}
                  >
                    <span
                      className={cn(
                        link.href === pathname
                          ? "bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text font-semibold text-transparent"
                          : "text-zinc-500 before:hidden before:bg-zinc-300 hover:text-zinc-600 hover:before:block dark:text-zinc-400 dark:before:bg-zinc-700 dark:hover:text-zinc-300"
                      )}
                    >
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
