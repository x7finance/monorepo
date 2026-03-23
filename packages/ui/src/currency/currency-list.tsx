/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
"use client"

import type { CSSProperties, FC } from "react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { List } from "react-window"

export interface ListProps<TData> {
  className?: string
  rowHeight?: number
  rowRenderer: FC<TData>
  rowData: TData[]
}

export type ListComponent = <TData>(
  props: ListProps<TData>
) => React.ReactElement | null

interface RowWrapperProps {
  rowData: readonly unknown[]
  RowComponent: FC<any>
}

function RowWrapper(
  props: RowWrapperProps & {
    ariaAttributes: Record<string, unknown>
    index: number
    style: CSSProperties
  }
) {
  const { rowData, RowComponent, index, style } = props
  return <RowComponent style={style} {...(rowData[index] as any)} />
}

export function CurrencyList<TData>({
  className,
  rowHeight,
  rowData,
  rowRenderer: RowComponent,
}: ListProps<TData>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(400)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const rowProps = useCallback(
    () => ({ rowData, RowComponent }) as RowWrapperProps,
    [rowData, RowComponent]
  )

  return (
    <div ref={containerRef} className={className} style={{ flex: 1 }}>
      <List<RowWrapperProps>
        defaultHeight={height}
        rowCount={rowData.length}
        rowHeight={rowHeight ?? 48}
        className="scrollbar rounded-lg bg-secondary"
        style={{ width: "100%", overflow: "overlay" }}
        rowComponent={RowWrapper}
        rowProps={rowProps()}
      />
    </div>
  )
}
