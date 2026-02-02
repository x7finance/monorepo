import Link from "next/link"
import * as React from "react"

import { cn } from "@x7/css"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "rounded-header-corners w-full min-w-full caption-bottom text-sm",
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-white/80 dark:bg-black/80 [&_tr]:border-b", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("x-body [&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-primary text-primary-foreground font-medium", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-secondary hover:bg-secondary hover:bg-opacity-50 data-[state=selected]:bg-secondary border-b transition-colors",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "text-muted-foreground h-12 px-2 text-left align-middle text-xs font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "relative h-[76px] p-4 align-middle text-sm font-medium [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

interface TableCellAsLink extends React.TdHTMLAttributes<HTMLTableCellElement> {
  href: string
  external: boolean
}

const TableCellAsLink = React.forwardRef<HTMLTableCellElement, TableCellAsLink>(
  ({ external, className, children, href, ...props }, ref) => (
    <td className="h-[76px] p-0!" ref={ref} {...props}>
      <Link
        prefetch={true}
        scroll={false}
        href={href}
        target={external ? "_blank" : "_self"}
        className={cn(
          "flex items-center p-4 align-middle text-sm font-medium [&:has([role=checkbox])]:pr-0",
          className
        )}
      >
        {children}
      </Link>
    </td>
  )
)
TableCellAsLink.displayName = "TableCellAsLink"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("text-muted-foreground mt-4 text-sm", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCellAsLink,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
