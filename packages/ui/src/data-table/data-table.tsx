/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
/* oxlint-disable @typescript-eslint/no-unused-vars */

"use client";

import type { ReactNode } from "react";
import { default as React } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Row,
  RowData,
  SortingState,
  TableState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table";

import { cn } from "@x7/css";

import {
  Table,
  TableBody,
  TableCell,
  TableCellAsLink,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    skeleton?: React.ReactNode;
    headerDescription?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: (table: TableType<TData>) => ReactNode;
  pagination?: boolean;
  loading: boolean;
  linkFormatter?: (value: TData) => string;
  externalLink?: boolean;
  state?: Partial<TableState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowRenderer?: (row: Row<TData>, value: ReactNode) => ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  pagination = false,
  loading,
  linkFormatter,
  externalLink = false,
  state,
  onSortingChange,
  onPaginationChange,
  rowRenderer,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility: state?.columnVisibility
        ? state.columnVisibility
        : columnVisibility,
      sorting: state?.sorting ? state.sorting : sorting,
      ...(state?.pagination && { pagination: state.pagination }),
    },
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: onSortingChange || setSorting,
    onPaginationChange: onPaginationChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 border-t border-secondary">
      {toolbar ? toolbar(table) : null}
      <Table className={pagination ? "border-b border-secondary" : ""}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    style={{ width: header.getSize() }}
                    key={header.id}
                    className={cn(header.column.getCanSort() ? "px-2" : "px-4")}
                  >
                    {header.isPlaceholder ? null : (
                      <DataTableColumnHeader
                        description={
                          header.column.columnDef.meta?.headerDescription
                        }
                        column={header.column}
                        title={header.column.columnDef.header as string}
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 })
              .fill(null)
              .map((_, i) => (
                <TableRow key={`skeleton-row-${i}`}>
                  {table.getVisibleFlatColumns().map((column, _i) => {
                    return (
                      <TableCell
                        style={{ width: column.getSize() }}
                        key={column.id}
                      >
                        {column.columnDef.meta?.skeleton}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const _row = (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, i) =>
                    linkFormatter ? (
                      <TableCellAsLink
                        style={{ width: cell.column.getSize() }}
                        href={linkFormatter(row.original)}
                        external={externalLink}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCellAsLink>
                    ) : (
                      <TableCell
                        style={{ width: cell.column.getSize() }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              );

              if (rowRenderer) return rowRenderer(row, _row);
              return _row;
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination ? (
        <div className="px-6 pb-6">
          <DataTablePagination table={table} />
        </div>
      ) : null}
    </div>
  );
}
