import type { FC, ReactNode } from "react"

import { cn } from "@x7/utils"

interface Column {
  header: string
  responsiveHeader?: string
  width?: string
  accessor: string
  responsive?: boolean
  cellRenderer?: (row: any) => ReactNode
}

interface TableProps {
  data: any[]
  columns: Column[]
}

export const Table: FC<TableProps> = ({ data, columns }) => {
  return (
    <table className="rounded-header-corners min-w-full">
      <thead className="bg-white/80 dark:bg-black/80 sm:-mx-6 md:mx-0">
        <tr>
          {columns.map((column, index) => (
            <th
              {...(column?.width && index === 0
                ? { width: column?.width }
                : {})}
              key={`${column.header}-${index}}`}
              className={cn(
                column?.responsive ? "hidden lg:table-cell" : "",
                "border-b border-t border-zinc-200 px-3 py-3 text-left text-xs font-semibold uppercase text-zinc-500 last:pr-8 last:text-right dark:border-zinc-800 first:sm:pl-6"
              )}
            >
              <>
                <span className="lg:hidden">
                  {column.responsiveHeader || column.header}
                </span>
                <span className="hidden lg:block">{column.header}</span>
              </>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="x-body">
        {data.map((row, index) => (
          <tr
            className="border-none"
            // @ts-expect-error
            key={`${data?.accessor ?? data?.header}-${index}}`}
          >
            {columns.map((column, colIndex) => (
              <td
                {...(column?.width && index === 0
                  ? { width: column?.width }
                  : {})}
                className={cn(
                  index === 0 ? "" : "",
                  colIndex === 0 ? "pl-4 sm:pl-6" : "",
                  column?.responsive ? "hidden lg:table-cell" : "",
                  "relative px-3 py-3.5 text-sm"
                )}
                key={colIndex}
              >
                {column.cellRenderer
                  ? column.cellRenderer(row)
                  : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
