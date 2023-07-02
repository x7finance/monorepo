import Link from "next/link"

import {
  breakdownsNavigation,
  docsNavigation,
  faqNavigation,
  guidesNavigation,
  integrationNavigation,
  onchainsNavigation,
  whitepaperNavigation,
} from "@/config/docs"
import { DocsTypes, DocType } from "@/lib/types"

import { Navigation } from "./navigation"
import { OnThisPageNav } from "./on-this-page-navigation"
import { SectionNavigation } from "./section-navigation"
import { Prose } from "./tags/prose"

interface DocsBaseProps {
  children: React.ReactNode
  title?: string
  date?: string
  tags?: string[]
  tableOfContents?: any
  docsType?: DocType
  slug?: string
}

function getNavigation(docsType?: DocType) {
  switch (docsType) {
    case DocsTypes.breakdowns:
      return breakdownsNavigation
    case DocsTypes.onchains:
      return onchainsNavigation
    case DocsTypes.whitepaper:
      return whitepaperNavigation
    case DocsTypes.faq:
      return faqNavigation
    case DocsTypes.guides:
      return guidesNavigation
    case DocsTypes.integration:
      return integrationNavigation
    default:
      return docsNavigation
  }
}

export function DocsBase(props: DocsBaseProps) {
  const { children, title, date, tags, tableOfContents, docsType, slug } = props

  const navigation = getNavigation(docsType)

  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === slug)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]

  let section = navigation.find((section) =>
    section.links.find((link) => link.href === slug)
  )

  return (
    <>
      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-zinc-50 dark:hidden" />
          <div className="absolute bottom-0 right-0  w-px h-12 top-16 bg-gradient-to-t dark:from-zinc-800 from-zinc-200 block" />
          <div className="absolute bottom-0 right-0  w-px top-28 dark:bg-zinc-800 bg-zinc-200 block" />
          <div className="scrollbar sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden pt-24 pb-16 pl-0.5">
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-10"
            />
          </div>
        </div>
        <div className="flex-auto max-w-2xl min-w-0 min-h-screen px-4 py-8 sm:pt-24 sm:pb-16 overflow-auto lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
          <Prose as="div">
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
                      return <code key={`${tag}-${key}`}>{tag}</code>
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
          <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 sm:hidden">
            <h4 className="my-6 text-center dark:text-zinc-600 text-zinc-400 font-semibold">
              Other helpful sections
            </h4>
          </div>
          <SectionNavigation className="space-y-1 mb-6 sm:hidden" />
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pt-24 xl:pr-6">
          <OnThisPageNav
            tableOfContents={tableOfContents}
            currentSlug={slug}
            section={section}
          />
        </div>
      </div>
    </>
  )
}
