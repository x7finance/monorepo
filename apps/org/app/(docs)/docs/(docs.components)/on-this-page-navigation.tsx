import { cn } from "utils"

import Link from "next/link"

export function OnThisPageNav(props: any) {
  const { tableOfContents, currentSlug } = props

  function isActive(section: any) {
    if (section.id === currentSlug) {
      return true
    }

    if (!section.children) {
      return false
    }

    return section.children.findIndex(isActive) > -1
  }

  return (
    <nav aria-labelledby="on-this-page-title" className="w-56">
      {tableOfContents?.length > 0 && (
        <>
          <h2
            id="on-this-page-title"
            className="text-sm font-medium font-display text-zinc-900 dark:text-white"
          >
            On this page
          </h2>
          <ol role="list" className="mt-4 space-y-3 text-sm">
            {tableOfContents?.map((section: any) => (
              <li key={section.id}>
                <h3>
                  <Link
                    href={`${currentSlug}#${section.id}`}
                    className={cn(
                      isActive(section)
                        ? "bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent"
                        : "font-normal text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    )}
                  >
                    {section.title}
                  </Link>
                </h3>
                {section?.children?.length > 0 && (
                  <ol
                    role="list"
                    className="pl-5 mt-2 space-y-3 text-zinc-500 dark:text-zinc-400"
                  >
                    {section.children.map((subSection: any) => (
                      <li key={subSection.id}>
                        <Link
                          href={`${currentSlug}#${subSection.id}`}
                          className={
                            isActive(subSection)
                              ? "text-violet-500"
                              : "hover:text-zinc-600 dark:hover:text-zinc-300"
                          }
                        >
                          {subSection.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </nav>
  )
}
