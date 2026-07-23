import type { Table } from "@tanstack/react-table"

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@x7/icons"

import { Button } from "../button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-wrap items-center justify-end space-x-6 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger>
            <Button variant="ghost" size="sm">
              {table.getState().pagination.pageSize} <ChevronDownIcon />
            </Button>
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-[100px] items-center justify-center whitespace-nowrap text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="ghost"
          className="hidden p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>

          <ChevronLeftIcon className="h-2 w-2" />
          <ChevronLeftIcon className="h-2 w-2" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="hidden p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronRightIcon className="h-2 w-2" />
          <ChevronRightIcon className="h-2 w-2" />
        </Button>
      </div>
    </div>
  )
}
