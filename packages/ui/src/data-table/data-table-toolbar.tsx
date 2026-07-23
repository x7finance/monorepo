/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { Table } from "@tanstack/react-table"

import { SearchIcon, XIcon } from "@x7/icons"

import { Button } from "./../button"
import { TextField } from "./../text-field"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  children: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2">
        <TextField
          icon={SearchIcon}
          type="text"
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
        />
        {children}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
