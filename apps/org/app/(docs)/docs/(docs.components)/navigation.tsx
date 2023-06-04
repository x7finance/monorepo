import { cn } from "utils"

import Link from "next/link"

export function Navigation({ navigation, className, slug }: any) {
  return (
    <nav className={cn("text-base lg:text-sm", className)}>
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
                      link.href === slug ? `before:bg-sky-500` : ``,
                      "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full"
                    )}
                  >
                    <span
                      className={cn(
                        link.href === slug
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
