"use client"

import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

import { Slot } from "./lib/slot"

function Dialog({ ...props }: React.ComponentProps<typeof BaseDialog.Root>) {
  return <BaseDialog.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  className,
  asChild,
  nativeButton = true,
  ...props
}: React.ComponentProps<typeof BaseDialog.Trigger> & {
  asChild?: boolean
  nativeButton?: boolean
}) {
  return (
    <BaseDialog.Trigger
      data-slot="dialog-trigger"
      className={cn("cursor-pointer", className)}
      render={asChild ? <Slot /> : undefined}
      nativeButton={nativeButton}
      {...props}
    />
  )
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof BaseDialog.Portal>) {
  return <BaseDialog.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  asChild,
  nativeButton = true,
  ...props
}: React.ComponentProps<typeof BaseDialog.Close> & {
  asChild?: boolean
  nativeButton?: boolean
}) {
  return (
    <BaseDialog.Close
      data-slot="dialog-close"
      render={asChild ? <Slot /> : undefined}
      nativeButton={nativeButton}
      {...props}
    />
  )
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/80 transition-opacity",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  hideClose,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup> & {
  hideClose?: boolean
}) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-zinc-200 p-6 shadow-lg transition-all duration-200 sm:max-w-lg dark:border-zinc-800",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          className
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <BaseDialog.Close className="ring-offset-background focus:ring-ring absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg leading-none font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

const DialogOverlay = DialogBackdrop

export {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
