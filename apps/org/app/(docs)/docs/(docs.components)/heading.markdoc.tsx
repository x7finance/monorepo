"use client"

import { remToPx } from "utils"
import { LinkIcon } from "icons"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useInView } from "framer-motion"

import { Tag } from "@/components/tag"

function Eyebrow({ tag, label }: any) {
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

function Anchor({ id, inView, children, href }: any) {
  return (
    <Link
      href={`${href}#${id}`}
      className="group text-inherit no-underline hover:text-inherit"
    >
      {inView && (
        <div className="absolute ml-[calc(-1*var(--width))] mt-1 hidden w-[var(--width)] opacity-0 transition [--width:calc(2.625rem+0.5px+50%-min(50%,calc(theme(maxWidth.xl)+theme(spacing.8))))] group-hover:opacity-100 group-focus:opacity-100 md:block lg:z-50 2xl:[--width:theme(spacing.10)]">
          <div className="group/anchor h-5 w-5 rounded-lg bg-zinc-50 ring-1 ring-inset ring-zinc-300 transition hover:ring-zinc-500 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600 flex justify-center items-center">
            <LinkIcon className="h-3.5 w-3.5 stroke-zinc-500 transition dark:stroke-zinc-400 dark:group-hover/anchor:stroke-white" />
          </div>
        </div>
      )}
      {children}
    </Link>
  )
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
}: any) {
  let Component = `h${level}`
  let ref: any = useRef()
  let pathname = usePathname()

  let inView = useInView(ref, {
    margin: `${remToPx(-3.5)}px 0px 0px 0px`,
    amount: "all",
  })

  return (
    <>
      <Eyebrow tag={tag} label={label} />
      <Component
        ref={ref}
        id={anchor ? id : undefined}
        className={tag || label ? "mt-2 scroll-mt-32" : "scroll-mt-24"}
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
