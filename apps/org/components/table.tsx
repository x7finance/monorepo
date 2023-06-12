import { cn } from "utils"

import React, { FC, ReactNode } from "react"

interface Column {
  header: string
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
    <table className="min-w-full rounded-header-corners">
      <thead className="dark:bg-black/80 sm:-mx-6 md:mx-0 bg-white/80">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className={cn(
                column?.responsive ? "hidden sm:table-cell" : "",
                "py-3 pl-4 pr-3 text-left text-xs font-semibold text-zinc-500 sm:pl-6 uppercase border-t border-b border-zinc-200 dark:border-zinc-800"
              )}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="x-body">
        {data.map((row, index) => (
          <tr className="border-none" key={index}>
            {columns.map((column, colIndex) => (
              <td
                className={cn(
                  index === 0 ? "" : "",
                  colIndex === 0 ? "sm:pl-6 pl-4" : "",
                  column?.responsive ? "hidden sm:table-cell" : "",
                  "relative py-3.5 px-3 text-sm"
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
