"use client"

import { createContext } from "react"

import type { ChainId } from "@x7/utils"

export interface Item {
  className?: string
  isEmpty?: boolean
  label: string
  value: number
  chain: ChainId
  address?: {
    result?: string
    status?: "success" | "loading" | "error"
  }
}

export type ItemWithRenderProps = Item & {
  angle: number
  classNames: string
  clickHandlers?: {
    onClick: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
  fill: string
  index: number
  opacity: number
  stroke: string
}

export type Colors = string[]

export interface Props {
  className?: string
  clickToggle?: boolean
  colorFunction?: (colors: Colors, index: number) => string
  colors?: Colors
  data: Item[]
  emptyColor?: string
  emptyOffset?: number
  formatValues?: (value: number, total: number) => string
  height?: number
  interactive?: boolean
  innerRadius?: number
  legend?: boolean
  onClick?: (item: Item, toggled: boolean) => void
  onMouseEnter?: (item: Item) => void
  onMouseLeave?: (item: Item) => void
  outerRadius?: number
  selectedOffset?: number
  strokeColor?: string
  toggledOffset?: number
  width?: number
}

export type Context = Pick<
  Required<Props>,
  | "className"
  | "emptyOffset"
  | "innerRadius"
  | "outerRadius"
  | "selectedOffset"
  | "toggledOffset"
  | "width"
> & {
  graphWidth: number
  selected: Item | null
  toggleSelect: boolean
  total: number
}

// oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DonutChartContext = createContext<Context>(undefined!)
