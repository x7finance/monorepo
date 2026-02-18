"use client"

import { DocSearchModal, useDocSearchKeyboardEvents } from "@docsearch/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { SearchIcon } from "@x7/icons"
import { Button } from "@x7/ui/button"
import { LinkInternal } from "@x7/ui/link"
import { env } from "~/env.mjs"

const docSearchConfig = {
  appId: env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
  apiKey: env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
  indexName: env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME,
}

function Hit({
  hit,
  children,
}: {
  hit: { url: string }
  children: React.ReactNode
}) {
  return (
    <LinkInternal prefetch={true} href={hit.url}>
      {children}
    </LinkInternal>
  )
}

export function Search({ isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAskAiActive, setIsAskAiActive] = useState(false)
  const [modifierKey, setModifierKey] = useState<string>("")
  const searchButtonRef = useRef(null)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onAskAiToggle = useCallback(() => {
    setIsAskAiActive((prev) => !prev)
  }, [setIsAskAiActive])

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    searchButtonRef,
    isAskAiActive,
    onAskAiToggle,
  })

  useEffect(() => {
    const modifierKey = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
      ? "⌘"
      : "K"
    setModifierKey(modifierKey)
  }, [])

  return (
    <>
      <div className="hidden sm:block sm:max-w-sm sm:flex-auto lg:max-w-md">
        <button
          type="button"
          className="flex h-8 w-full items-center gap-2 rounded-full bg-white pr-3 pl-2 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 focus:not-focus-visible:outline-hidden dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10 dark:ring-inset dark:hover:ring-white/20"
          onClick={onOpen}
          ref={searchButtonRef}
        >
          <SearchIcon className="h-3.5 w-3.5 stroke-current" />
          <span className="hidden md:flex">Find something...</span>
          <kbd className="text-2xs ml-auto text-zinc-400 dark:text-zinc-500">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        </button>
      </div>
      {isMobile && (
        <div className="flex items-center justify-center lg:hidden">
          <Button
            name="mobile-search"
            variant={"ghost"}
            size={"sm"}
            aria-label="Find something..."
            onClick={onOpen}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
      {isOpen &&
        createPortal(
          <DocSearchModal
            {...docSearchConfig}
            initialScrollY={window.scrollY}
            onClose={onClose}
            hitComponent={Hit}
            onAskAiToggle={onAskAiToggle}
          />,
          document.body
        )}
    </>
  )
}
