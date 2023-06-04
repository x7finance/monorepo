import { cn } from "utils"

import Link from "next/link"

import {
  docsNavigation,
  faqNavigation,
  onchainsNavigation,
  whitepaperNavigation,
} from "@/config/docs"

import { Prose } from "../../../../components/markdoc/prose"
import { Navigation } from "./navigation"

function useTableOfContents(tableOfContents: any) {
  // let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)

  // let getHeadings = useCallback((tableOfContents: any) => {
  //   return tableOfContents
  //     .flatMap((node: any) => [
  //       node.id,
  //       ...node.children.map((child: any) => child.id),
  //     ])
  //     .map((id: string) => {
  //       let el = document.getElementById(id)
  //       if (!el) return

  //       let style = window.getComputedStyle(el)
  //       let scrollMt = parseFloat(style.scrollMarginTop)

  //       let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
  //       return { id, top }
  //     })
  // }, [])

  // useEffect(() => {
  //   if (tableOfContents.length === 0) return
  //   let headings = getHeadings(tableOfContents)
  //   function onScroll() {
  //     let top = window.scrollY
  //     let current = headings[0].id
  //     for (let heading of headings) {
  //       if (top >= heading.top) {
  //         current = heading.id
  //       } else {
  //         break
  //       }
  //     }
  //     setCurrentSection(current)
  //   }
  //   window.addEventListener("scroll", onScroll, { passive: true })
  //   onScroll()
  //   return () => {
  //     // @ts-expect-error
  //     window.removeEventListener("scroll", onScroll, { passive: true })
  //   }
  // }, [getHeadings, tableOfContents])

  return tableOfContents?.[0]?.id
  // return currentSection
}

export function DocsBase({
  children,
  title,
  date,
  tags,
  tableOfContents,
  docsType,
  slug,
}: any) {
  const navigation =
    docsType === "onchains"
      ? onchainsNavigation
      : docsType === "whitepaper"
      ? whitepaperNavigation
      : docsType === "faq"
      ? faqNavigation
      : docsNavigation

  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === slug)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === slug)
  )
  let currentSection = useTableOfContents(tableOfContents)

  function isActive(section: any) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  return (
    <>
      <div className="relative flex justify-center mx-auto max-w-8xl sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-zinc-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-zinc-800 dark:block" />
          <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-zinc-800 dark:block" />
          <div className="scrollbar sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-16"
            />
          </div>
        </div>
        <div className="flex-auto max-w-2xl min-w-0 min-h-screen px-4 py-16 overflow-auto lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
          <Prose as="article">
            <>
              {(title || section) && (
                <header className="space-y-1 mb-9">
                  {section && (
                    <div className="text-sm font-medium font-display">
                      <span className="text-transparent bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text">
                        {section.title}
                      </span>
                    </div>
                  )}
                  {!!tags?.length &&
                    tags.map((tag: string, key: number) => {
                      return (
                        <code
                          key={`${tag}-${key}`}
                          className="bg-sky-600/80 hover:bg-sky-700 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20 dark:hover:bg-sky-400/10 dark:hover:text-sky-300 dark:hover:ring-sky-300 ring-sky-700"
                          // className="mr-1 inline-flex justify-center gap-0.5 overflow-hidden rounded-full  px-3 py-0.5 text-xs font-medium text-white ring-1 ring-inset  transition "
                        >
                          {tag}
                        </code>
                      )
                    })}
                  {title && <h1>{title}</h1>}
                  {date && (
                    <h2 className="text-xl tracking-tight font-display text-zinc-900 dark:text-white">
                      {date}
                    </h2>
                  )}
                </header>
              )}

              {children}
            </>
          </Prose>

          <dl className="flex pt-6 mt-12 border-t border-zinc-200 dark:border-zinc-800">
            {previousPage && (
              <div>
                <dt className="text-sm font-medium font-display text-zinc-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    href={previousPage.href}
                    className="text-base font-semibold text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage.title}
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="text-sm font-medium font-display text-zinc-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    href={nextPage.href}
                    className="text-base font-semibold text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    {nextPage.title} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
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
                          href={`#${section.id}`}
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
                                href={`#${subSection.id}`}
                                className={
                                  isActive(subSection)
                                    ? "text-purple-500"
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
        </div>
      </div>
    </>
  )
}
