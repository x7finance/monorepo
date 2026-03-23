/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
"use client"

import type { CSSProperties, FC, ReactElement } from "react"
import React, { useCallback } from "react"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { List } from "react-window"

type RowCallback<_TData> = (row: {
  index: number
  style: CSSProperties
}) => ReactElement

export interface ListProps<TData> {
  className?: string
  rowHeight?: number
  rowRenderer: FC<TData>
  rowData: TData[]
}

export type ListComponent = <TData>(
  props: ListProps<TData>
) => React.ReactElement | null

export function CurrencyList<TData>({
  className,
  rowHeight,
  rowData,
  rowRenderer: RowComponent,
}: ListProps<TData>) {
  const Row: any = useCallback<RowCallback<TData>>(
    ({ index, style }) => {
      return <RowComponent style={style} {...rowData[index]!} />
    },
    [RowComponent, rowData]
  )

  return (
    <AutoSizer disableWidth className={className}>
      {({ height }: { height: number }) => {
        return (
          <List
            style={{ width: "100%", overflow: "overlay" }}
            defaultHeight={height}
            rowCount={rowData.length}
            rowHeight={rowHeight ?? 48}
            className="scrollbar rounded-lg bg-secondary"
            rowComponent={Row}
          />
        )
      }}
    </AutoSizer>
  )
}
