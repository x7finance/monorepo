"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@x7/utils"

export function OnThisPageNav(props: any) {
  const { tableOfContents, currentSlug } = props

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
                <StyledHeader section={section} currentSlug={currentSlug} />
                {section?.children?.length > 0 && (
                  <ol
                    role="list"
                    className="pl-5 mt-2 space-y-3 text-zinc-500 dark:text-zinc-400"
                  >
                    {section.children.map((subSection: any) => (
                      <StyledLineItem
                        key={subSection.id}
                        currentSlug={currentSlug}
                        subSection={subSection}
                      />
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

function isActive(section: any) {
  if (
    typeof window !== "undefined" &&
    window.location.hash === `#${section?.id}`
  ) {
    return true
  }

  if (!section.children) {
    return false
  }

  return section.children.findIndex(isActive) > -1
}

const activeHeader =
  "bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent"
const inactiveHeader =
  "font-normal text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"

const activeSubHeader = "text-violet-500"
const inactiveSubHeader = "hover:text-zinc-600 dark:hover:text-zinc-300"

function StyledHeader(props: any) {
  const { currentSlug, section } = props
  const [headerStyling, setHeaderStyling] = useState(inactiveHeader)

  useEffect(() => {
    isActive(section)
      ? setHeaderStyling(activeHeader)
      : setHeaderStyling(inactiveHeader)
  }, [])

  return (
    <h3>
      <Link href={`${currentSlug}#${section.id}`} className={cn(headerStyling)}>
        {section.title}
      </Link>
    </h3>
  )
}

function StyledLineItem(props: any) {
  const { currentSlug, subSection } = props
  const [headerStyling, setHeaderStyling] = useState(inactiveHeader)

  useEffect(() => {
    isActive(subSection)
      ? setHeaderStyling(activeSubHeader)
      : setHeaderStyling(inactiveSubHeader)
  }, [])

  return (
    <Link
      href={`${currentSlug}#${subSection.id}`}
      className={cn(headerStyling)}
    >
      {subSection.title}
    </Link>
  )
}
