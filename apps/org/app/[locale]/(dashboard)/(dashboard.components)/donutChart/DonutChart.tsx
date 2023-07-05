"use client"

import React, { createContext, useEffect, useState } from "react"

import { ArcPath } from "./ArcPath"
import { LegendItem } from "./LegendItem"

export type Item = {
  className?: string
  isEmpty?: boolean
  label: string
  value: number
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
export type Props = {
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

export const DonutChartContext = createContext<Context>(undefined!)

export const DonutChart: React.FC<Props> = ({
  className = "donutchart",
  clickToggle = true,
  colorFunction = (colors, index) => colors[index % colors.length],
  colors = [
    "#4066b9",
    "#950ad0",
    "#c22e5e",
    "#971264",
    "#2002d7",
    "#212984",
    "#b7dde4",
    "#17dce5",
    "#16e4ab",
    "#795548",
    "#607d8b",
  ],
  data = [
    {
      className: "",
      label: "",
      value: 100,
      isEmpty: true,
    },
  ],
  emptyColor = "#e0e0e0",
  emptyOffset = 0.08,
  formatValues = (value, total) =>
    Number.isNaN(value / total)
      ? "--"
      : `${((value / total) * 100).toFixed(0)}%`,
  height = 500,
  interactive = true,
  innerRadius = 0.7,
  legend = true,
  onMouseEnter = (item) => item,
  onMouseLeave = (item) => item,
  onClick = (item, toggled) => (toggled ? item : null),
  outerRadius = 0.9,
  selectedOffset = 0.03,
  strokeColor = "#212121",
  toggledOffset = 0.04,
  width = 750,
}) => {
  const [selected, setSelected] = useState<any>(null)
  const [toggleSelect, setToggleSelect] = useState(false)

  useEffect(() => {
    if (interactive) {
      setSelected(null)
      setToggleSelect(false)
    }
  }, [interactive, data])

  const graphWidth = legend ? width * (2 / 3) : width
  const total = data.reduce((sum, { value }) => sum + value, 0)

  const { dataWithRenderProps } = data.reduce(
    ({ angle, dataWithRenderProps }, item, index) => {
      const { className, isEmpty, label, value } = item
      const isSelected = selected?.label === label
      const isToggled = isSelected && toggleSelect

      return {
        angle: angle + (value / total) * 360,
        dataWithRenderProps: [
          ...dataWithRenderProps,
          {
            angle,
            index,
            ...item,
            classNames: `${className ?? ""} ${isEmpty ? "empty" : ""} ${
              isSelected ? "selected" : ""
            } ${isToggled ? "toggled" : ""}`.trim(),
            fill: isEmpty ? emptyColor : colorFunction(colors, index),
            opacity: isSelected && !toggleSelect ? 0.5 : 1,
            stroke: isEmpty ? emptyColor : strokeColor,
            clickHandlers: interactive
              ? {
                  onClick: () => {
                    if (selected?.label === label) {
                      const toggle = clickToggle ? !toggleSelect : false
                      setSelected(item)
                      setToggleSelect(toggle)
                      onClick(item, toggle)
                    }
                  },
                  onMouseEnter: () => {
                    if (!toggleSelect) {
                      setSelected(item)
                      onMouseEnter(item)
                    }
                  },

                  onMouseLeave: () => {
                    if (!toggleSelect) {
                      onMouseLeave(item)
                    }
                  },
                }
              : undefined,
          },
        ],
        total: total + value,
      }
    },
    { angle: 0, dataWithRenderProps: [] as ItemWithRenderProps[] }
  )

  return (
    <>
      <DonutChartContext.Provider
        value={{
          className,
          emptyOffset,
          graphWidth,
          innerRadius,
          outerRadius,
          selected,
          selectedOffset,
          toggledOffset,
          toggleSelect,
          total,
          width,
        }}
      >
        <div className="flex h-52 items-center justify-center">
          <svg className="relative left-[10%] flex h-full w-auto items-center justify-center sm:left-[5%]">
            <g className={`${className}-arcs`}>
              {dataWithRenderProps.map((item) => (
                <ArcPath item={item} key={`arcpath${item.index}`} />
              ))}
            </g>
            {selected && (
              <g className={`${className}-innertext`}>
                <text
                  className={`fill-zinc-900 font-bold underline dark:fill-zinc-100`}
                  x={graphWidth / 2}
                  y="98%"
                  textAnchor="middle"
                >
                  {selected.label}
                </text>
                <text
                  className={`${className}-innertext-value fill-zinc-900 text-2xl dark:fill-zinc-100`}
                  x={graphWidth / 2}
                  y="52%"
                  textAnchor="middle"
                >
                  {formatValues(selected.value, total)}
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="flow-root">
          <div className="-mx-6 -my-2 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-0 md:w-20 lg:w-full"
                    >
                      <span className="group inline-flex uppercase text-zinc-500">
                        Name
                      </span>
                    </th>

                    <th
                      scope="col"
                      className="flex justify-end px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      <span className="group inline-flex uppercase text-zinc-500">
                        Share
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                  {dataWithRenderProps.map((item, idx) => (
                    <LegendItem
                      key={`legenditem-${item.index}-${idx}`}
                      item={item}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DonutChartContext.Provider>
    </>
  )
}
