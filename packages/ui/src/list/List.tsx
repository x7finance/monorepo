import type { ListControlProps } from "./ListControl"
import type { ListItemComponent } from "./ListItem"
import type { ListKeyValueProps } from "./ListKeyValue"
import type { ListLabelProps } from "./ListLabel"
import type { ListMenuItemComponent } from "./ListMenuItem"
import type { FC, ReactNode } from "react"

import { cn } from "@x7/css"

import { ListControl } from "./ListControl"
import { ListItem } from "./ListItem"
import { ListKeyValue } from "./ListKeyValue"
import { ListLabel } from "./ListLabel"
import { ListMenuItem } from "./ListMenuItem"

type List<T> = FC<T> & {
  Item: ListItemComponent
  MenuItem: ListMenuItemComponent
  Label: FC<ListLabelProps>
  Control: FC<ListControlProps>
  KeyValue: FC<ListKeyValueProps>
}

export interface ListProps {
  children: ReactNode
  className?: string
}

export const List: List<ListProps> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col gap-3 pt-3", className)}>{children}</div>
  )
}

List.Item = ListItem
List.MenuItem = ListMenuItem
List.Label = ListLabel
List.Control = ListControl
List.KeyValue = ListKeyValue
