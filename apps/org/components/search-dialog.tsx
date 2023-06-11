"use client"

import { Button } from "ui"
import { SearchIcon } from "icons"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { DocSearchModal, useDocSearchKeyboardEvents } from "@docsearch/react"
import { createPortal } from "react-dom"

const docSearchConfig = {
  appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
  indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME,
}

function Hit({ hit, children }: { hit: any; children: any }) {
  return <Link href={hit.url}>{children}</Link>
}

export function Search({ isMobile = false }) {
  let [isOpen, setIsOpen] = useState(false)
  let [modifierKey, setModifierKey] = useState()

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose })

  useEffect(() => {
    setModifierKey(
      // @ts-expect-error
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "K"
    )
  }, [])

  return (
    <>
      <div className="hidden sm:block sm:max-w-sm lg:max-w-md sm:flex-auto">
        <button
          type="button"
          className="flex h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 focus:[&:not(:focus-visible)]:outline-none"
          onClick={onOpen}
        >
          <SearchIcon className="h-3.5 w-3.5 stroke-current" />
          Find something...
          <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        </button>
      </div>
      {isMobile && (
        <div className="contents lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0 z-40 relative"
            aria-label="Find something..."
            onClick={onOpen}
          >
            <SearchIcon className="h-6 w-6 stroke-zinc-900 dark:stroke-white" />
          </Button>
        </div>
      )}
      {isOpen &&
        createPortal(
          // @ts-expect-error
          <DocSearchModal
            {...docSearchConfig}
            initialScrollY={window.scrollY}
            onClose={onClose}
            hitComponent={Hit}
          />,
          document.body
        )}
    </>
  )
}
