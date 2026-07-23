"use client"

import { usePathname } from "next/navigation"
import type { ElementType, ReactNode } from "react"
import { useRef } from "react"

import { remToPx } from "@x7/css"
import { LinkIcon } from "@x7/icons"
import { useInView } from "@x7/ui"
import { LinkInternal } from "@x7/ui/link"
import { Tag } from "@x7/ui/tag"

interface EyebrowProps {
  tag?: string
  label?: string
}

function Eyebrow({ tag, label }: EyebrowProps) {
  if (!tag && !label) {
    return null
  }

  return (
    <div className="flex items-center gap-x-3">
      {tag && <Tag>{tag}</Tag>}
      {tag && label && (
        <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      )}
      {label && (
        <span className="font-mono text-xs text-zinc-400">{label}</span>
      )}
    </div>
  )
}

interface AnchorProps {
  id: string
  inView: boolean
  children: ReactNode
  href: string
}

function Anchor({ id, inView, children, href }: AnchorProps) {
  return (
    <LinkInternal
      prefetch={true}
      href={`${href}#${id}`}
      className="group text-inherit no-underline hover:text-inherit"
    >
      {inView && (
        <div className="absolute mt-1 ml-[calc(-1*var(--width))] hidden w-[var(--width)] opacity-0 transition [--width:calc(1.625rem+0.5px+50%-min(50%,calc(var(--container-xl)+(--spacing(8)))))] group-hover:opacity-100 group-focus:opacity-100 md:block lg:z-50 2xl:[--width:--spacing(10)]">
          <div className="group/anchor flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-50 ring-1 ring-zinc-300 transition ring-inset hover:ring-zinc-500 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600">
            <LinkIcon className="h-3.5 w-3.5 stroke-zinc-500 transition dark:stroke-zinc-400 dark:group-hover/anchor:stroke-white" />
          </div>
        </div>
      )}
      {children}
    </LinkInternal>
  )
}

interface HeadingProps {
  level?: number
  children: ReactNode
  id: string
  tag?: string
  label?: string
  subHeader?: string
  anchor?: boolean
}

export function Heading({
  level = 2,
  children,
  id,
  tag,
  label,
  subHeader,
  anchor = true,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as ElementType
  const ref = useRef(null)
  const pathname = usePathname()

  const inView = useInView(ref, {
    margin: `${remToPx(-3.5)}px 0px 0px 0px`,
    amount: "all",
  })

  return (
    <>
      <Eyebrow tag={tag} label={label} />
      <Component
        ref={ref}
        id={anchor ? id : undefined}
        className={(tag ?? label) ? "mt-2 scroll-mt-32" : "scroll-mt-24"}
        {...props}
      >
        {anchor ? (
          <Anchor href={pathname} id={id} inView={inView}>
            {children}
          </Anchor>
        ) : (
          children
        )}
        {subHeader && (
          <p className="mt-2 text-sm font-normal text-zinc-700 dark:text-zinc-300">
            {subHeader}
          </p>
        )}
      </Component>
    </>
  )
}
