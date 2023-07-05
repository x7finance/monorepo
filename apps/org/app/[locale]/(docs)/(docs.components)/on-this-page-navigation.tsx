"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { cn } from "@x7/utils"

interface Section {
  id: string
  title: string
  children: Section[]
}

interface StyledHeaderProps {
  section: Section
  currentSlug: string
}

interface StyledLineItemProps {
  subSection: Section
  currentSlug: string
}

interface OnThisPageNavProps {
  tableOfContents: Section[]
  currentSlug: string
}

const activeHeader =
  "bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent"
const inactiveHeader =
  "font-normal text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"

const activeSubHeader = "text-violet-500"
const inactiveSubHeader = "hover:text-zinc-600 dark:hover:text-zinc-300"

export function OnThisPageNav({
  tableOfContents,
  currentSlug,
}: OnThisPageNavProps) {
  return (
    <nav aria-labelledby="on-this-page-title" className="w-56">
      {tableOfContents?.length > 0 && (
        <>
          <h2
            id="on-this-page-title"
            className="font-display text-sm font-medium text-zinc-900 dark:text-white"
          >
            On this page
          </h2>
          <ol className="mt-4 space-y-3 text-sm">
            {tableOfContents?.map((section: Section) => (
              <li key={section.id}>
                <StyledHeader section={section} currentSlug={currentSlug} />
                {section?.children?.length > 0 && (
                  <ol className="mt-2 space-y-3 pl-5 text-zinc-500 dark:text-zinc-400">
                    {section.children.map((subSection: Section) => (
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

function isActive(section: Section): boolean {
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

function StyledHeader({ currentSlug, section }: StyledHeaderProps) {
  const [headerStyling, setHeaderStyling] = useState(inactiveHeader)

  useEffect(() => {
    isActive(section)
      ? setHeaderStyling(activeHeader)
      : setHeaderStyling(inactiveHeader)
  }, [section])

  return (
    <h3>
      <Link href={`${currentSlug}#${section.id}`}>
        <span className={cn(headerStyling)}>{section.title}</span>
      </Link>
    </h3>
  )
}

function StyledLineItem({ currentSlug, subSection }: StyledLineItemProps) {
  const [headerStyling, setHeaderStyling] = useState(inactiveHeader)

  useEffect(() => {
    isActive(subSection)
      ? setHeaderStyling(activeSubHeader)
      : setHeaderStyling(inactiveSubHeader)
  }, [subSection])

  return (
    <Link href={`${currentSlug}#${subSection.id}`}>
      <span className={cn(headerStyling)}>{subSection.title}</span>
    </Link>
  )
}
