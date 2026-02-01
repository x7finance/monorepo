/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */

import type { DocType } from "../_types"
import type { SectionType } from "~/types"

import { LinkInternal } from "@x7/ui/link"
import {
  BREAKDOWNS_NAVIGATION,
  DOCS_NAVIGATION,
  FAQ_NAVIGATION,
  GUIDES_NAVIGATION,
  INTEGRATION_NAVIGATION,
  ONCHAINS_NAVIGATION,
  WHITEPAPER_NAVIGATION,
} from "~/app/(docs)/_config/docs"

import { DocsTypes } from "../_types"

import { Navigation } from "./navigation"
import { OnThisPageNav } from "./on-this-page-navigation"
import { SectionNavigation } from "./section-navigation"
import { Prose } from "./tags/prose"

interface DocsBaseProps {
  children: React.ReactNode
  title?: string
  date?: string
  tags?: string[]
  tableOfContents?: SectionType[] | null
  docsType?: DocType
  slug?: string
}

function getNavigation(docsType?: DocType) {
  switch (docsType) {
    case DocsTypes.breakdowns:
      return BREAKDOWNS_NAVIGATION
    case DocsTypes.onchains:
      return ONCHAINS_NAVIGATION
    case DocsTypes.whitepaper:
      return WHITEPAPER_NAVIGATION
    case DocsTypes.faq:
      return FAQ_NAVIGATION
    case DocsTypes.guides:
      return GUIDES_NAVIGATION
    case DocsTypes.integration:
      return INTEGRATION_NAVIGATION
    default:
      return DOCS_NAVIGATION
  }
}

export function DocsBase(props: DocsBaseProps) {
  const { children, title, date, tags, tableOfContents, docsType, slug } = props

  const navigation = getNavigation(docsType)

  const allLinks = navigation.flatMap((section) => section.links)
  const linkIndex = allLinks.findIndex((link) => link.href === slug)
  const previousPage = allLinks[linkIndex - 1]
  const nextPage = allLinks[linkIndex + 1]

  const section = navigation.find((section) =>
    section.links.find((link) => link.href === slug)
  )

  return (
    <>
      <div className="max-w-8xl relative mx-auto flex justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-zinc-50 dark:hidden" />
          <div className="absolute top-16 right-0 bottom-0 block h-12 w-px bg-linear-to-t from-zinc-200 dark:from-zinc-800" />
          <div className="absolute top-28 right-0 bottom-0 block w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="scrollbar sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-x-hidden overflow-y-auto pt-24 pb-16 pl-0.5">
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-10"
            />
          </div>
        </div>
        <div className="min-h-screen max-w-2xl min-w-0 flex-auto overflow-auto px-4 py-8 sm:pt-24 sm:pb-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <Prose as="div">
            <>
              {(title ?? section) && (
                <header className="mb-9 space-y-1">
                  {section && (
                    <div className="font-display text-sm font-medium">
                      <span className="bg-linear-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">
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
                    <h2 className="font-display text-xl tracking-tight text-zinc-900 dark:text-white">
                      {date}
                    </h2>
                  )}
                </header>
              )}

              {children}
            </>
          </Prose>

          <dl className="mt-12 flex border-t border-zinc-200 pt-6 dark:border-zinc-800">
            {previousPage && (
              <div>
                <dt className="font-display text-sm font-medium text-zinc-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <LinkInternal
                    prefetch={true}
                    href={previousPage.href}
                    className="hover:text-muted-foreground text-base font-semibold text-zinc-500 dark:hover:text-zinc-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage.title}
                  </LinkInternal>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="font-display text-sm font-medium text-zinc-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <LinkInternal
                    prefetch={true}
                    href={nextPage.href}
                    className="hover:text-muted-foreground text-base font-semibold text-zinc-500 dark:hover:text-zinc-300"
                  >
                    {nextPage.title} <span aria-hidden="true">&rarr;</span>
                  </LinkInternal>
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-6 border-t border-zinc-200 sm:hidden dark:border-zinc-800">
            <h4 className="my-6 hidden text-center font-semibold text-zinc-400 dark:text-zinc-600">
              -
            </h4>
          </div>
          <SectionNavigation className="mb-6 space-y-1 sm:hidden" />
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:pt-24 xl:pr-6 xl:pb-16">
          <OnThisPageNav
            tableOfContents={tableOfContents!}
            currentSlug={`${slug}`}
            section={section as any}
          />
        </div>
      </div>
    </>
  )
}
