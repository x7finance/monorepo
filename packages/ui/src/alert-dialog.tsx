"use client"

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"
import * as React from "react"

import { cn } from "@x7/css"

import { buttonVariants } from "./button"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Root>) {
  return <BaseAlertDialog.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Trigger>) {
  return (
    <BaseAlertDialog.Trigger
      data-slot="alert-dialog-trigger"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Portal>) {
  return <BaseAlertDialog.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Backdrop>) {
  return (
    <BaseAlertDialog.Backdrop
      data-slot="alert-dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/80 transition-opacity",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Popup>) {
  return (
    <AlertDialogPortal>
      <AlertDialogBackdrop />
      <BaseAlertDialog.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg transition-all duration-200 sm:max-w-lg",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

const AlertDialogOverlay = AlertDialogBackdrop

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBackdrop,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
