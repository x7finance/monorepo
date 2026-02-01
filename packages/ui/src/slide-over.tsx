"use client"

import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { useCallback, useEffect } from "react"

import { cn } from "@x7/css"
import { ChevronsRightIcon } from "@x7/icons"

import { VisuallyHidden } from "./visually-hidden"

interface SliderOverProps {
  open: boolean
  setOpen: (open: boolean) => void
  children?: React.ReactNode
}

export function SliderOver({ open, setOpen, children }: SliderOverProps) {
  // Close on escape key press
  useEffect(() => {
    const escapeKeyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault()
        setOpen(false)
      }
    }

    document.addEventListener("keydown", escapeKeyDownHandler)
    return () => document.removeEventListener("keydown", escapeKeyDownHandler)
  }, [open, setOpen])

  // Memoize the onOpenChange callback
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
    },
    [setOpen]
  )

  return (
    <BaseDialog.Root open={open} onOpenChange={handleOpenChange}>
      <div
        className={cn(
          `fixed inset-y-0 right-0 z-50 flex max-w-full transition duration-150 ease-in-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`
        )}
      >
        <BaseDialog.Backdrop className="group relative left-4 mt-3 h-screen cursor-pointer pb-24 duration-150 ease-in-out hover:translate-x-2">
          <VisuallyHidden>
            <BaseDialog.Title>SlideOver</BaseDialog.Title>
          </VisuallyHidden>
          <div className="h-full w-20 rounded-sm rounded-l-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
            <div className="mt-16 flex justify-center pt-8">
              <ChevronsRightIcon className="h-10 w-10 text-zinc-700 group-hover:text-zinc-400 dark:text-zinc-400 dark:group-hover:text-zinc-600" />
            </div>
          </div>
        </BaseDialog.Backdrop>
        <BaseDialog.Popup aria-describedby="slideover-description">
          <div className="pointer-events-auto min-h-screen w-screen max-w-sm rounded-2xl p-3">
            <div className="scrollbar relative flex h-full flex-col overflow-y-auto rounded-xl border border-r-2 border-zinc-300 dark:border-zinc-700">
              <div className="relative flex-1 rounded-xl bg-background px-4 py-5">
                {children}
              </div>
            </div>
          </div>
        </BaseDialog.Popup>
      </div>
    </BaseDialog.Root>
  )
}
