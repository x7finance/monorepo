"use client"

import { Accordion as BaseAccordion } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@x7/css"

function Accordion({
  type: _type,
  collapsible: _collapsible,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Root> & {
  type?: "single" | "multiple"
  collapsible?: boolean
}) {
  return <BaseAccordion.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionHeader({
  className,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Header>) {
  return (
    <BaseAccordion.Header
      data-slot="accordion-header"
      className={cn("flex", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <AccordionHeader>
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all hover:underline focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </BaseAccordion.Trigger>
    </AccordionHeader>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm transition-all",
        "data-[ending-style]:h-0 data-[starting-style]:h-0",
        className
      )}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </BaseAccordion.Panel>
  )
}

export {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
}
