import type { FC, ReactNode } from "react"

import { cn } from "@x7/css"

import { Card } from "../card"

export interface ListControlProps {
  children: ReactNode
  className?: string
}

export const ListControl: FC<ListControlProps> = ({ children, className }) => {
  return (
    <Card
      className={cn(
        "min-h-[256px] overflow-hidden rounded-xl border shadow-xs",
        className
      )}
    >
      {children}
    </Card>
  )
}
