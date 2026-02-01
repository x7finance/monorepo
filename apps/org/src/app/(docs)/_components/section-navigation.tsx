"use client"

import Image from "next/image"

import { LinkInternal } from "@x7/ui/link"
import { getRandomPioneerNumber } from "@x7/utils"
import { DocsLinks } from "~/types/links"

interface TopNavigationLink {
  href: string
  title: string
  section: string
  pioneerId: string
}

const TOP_NAVIGATION: TopNavigationLink[] = [
  {
    href: DocsLinks.Guides,
    title: "Guides",
    section: "guides",
    pioneerId: getRandomPioneerNumber(),
  },
  {
    section: "integration",
    href: DocsLinks.Integrating,
    title: "Integration",
    pioneerId: getRandomPioneerNumber(),
  },
  {
    section: "whitepaper",
    href: DocsLinks.Whitepaper,
    title: "Whitepaper",
    pioneerId: getRandomPioneerNumber(),
  },
  {
    section: "breakdowns",
    href: DocsLinks.Breakdowns,
    title: "Breakdowns",
    pioneerId: getRandomPioneerNumber(),
  },
  {
    section: "onchains",
    href: DocsLinks.Onchains,
    title: "Onchains",
    pioneerId: getRandomPioneerNumber(),
  },
  {
    section: "faq",
    href: DocsLinks.FAQ,
    title: "FAQ",
    pioneerId: getRandomPioneerNumber(),
  },
]

export function SectionNavigation({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {TOP_NAVIGATION.map((link) => (
        <li key={link.href} className="relative">
          <LinkInternal prefetch={true} href={link.href} className="group">
            <div className="flex items-center px-0 py-1 pl-0.5">
              <Image
                alt={`Pioneer ${link.pioneerId} avatar`}
                height={200}
                width={200}
                src={`https://assets.x7finance.org/pioneers/${link.pioneerId}.png`}
                className="h-10 w-10 flex-none rounded-full ring-[2px] ring-zinc-400/20"
              />
              <div className="ml-4 flex-auto">
                <div className="font-medium text-zinc-700 dark:text-zinc-300 dark:group-hover:text-white">
                  {link.title}
                </div>
              </div>
              <div className="pointer-events-auto ml-4 flex-none rounded-lg px-2 py-[0.3125rem] font-medium text-zinc-700 shadow-xs ring-1 ring-zinc-700/10 dark:text-zinc-400 dark:ring-zinc-700/50 dark:group-hover:bg-black dark:group-hover:text-white">
                View
              </div>
            </div>
          </LinkInternal>
        </li>
      ))}
    </ul>
  )
}
