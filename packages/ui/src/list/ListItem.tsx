import type { IconProps, PolymorphicComponentProps } from "../types"
/* oxlint-disable @typescript-eslint/unbound-method */
import type { ReactNode } from "react"

import React from "react"

import { cn } from "@x7/css"

import { SkeletonCircle, SkeletonText } from "../skeleton"

interface Props {
  title: ReactNode
  subtitle?: ReactNode
  onClick?(): void
  value?: ReactNode
  loading?: boolean
}

export type ListItemProps<
  P extends React.ElementType,
  C extends React.ElementType,
> = {
  icon?: P
  iconProps: IconProps
} & PolymorphicComponentProps<C, Props>

export type ListItemComponent = <
  P extends React.ElementType = "svg",
  C extends React.ElementType = "button",
>(
  props: ListItemProps<P, C>
) => React.ReactElement | null

export const ListItem: ListItemComponent = ({
  as,
  icon: Icon,
  iconProps,
  subtitle,
  title,
  onClick,
  className,
  value,
  loading = false,
  ...rest
}) => {
  const Component = as ?? "button"

  return (
    <Component
      {...rest}
      type="button"
      onClick={onClick}
      className={cn(
        className,
        subtitle ? "items-start" : "items-center",
        "relative flex w-full cursor-pointer gap-4 px-4 py-3"
      )}
    >
      {loading ? (
        <>
          {Icon && <SkeletonCircle radius={iconProps.width ?? 18} />}
          <div className="flex w-full flex-col items-start gap-0.5">
            <SkeletonText fontSize="sm" />
            {subtitle && <SkeletonText fontSize="xs" />}
          </div>
        </>
      ) : (
        <>
          {Icon && (
            <div
              style={{
                minWidth: iconProps.width ?? 18,
                minHeight: iconProps.height ?? 18,
                paddingTop: subtitle ? 1 : 0,
              }}
            >
              {React.createElement(Icon, {
                width: 18,
                height: 18,
                strokeWidth: 2,
                ...iconProps,
                className: cn(
                  iconProps.className,
                  "text-emerald-500 rounded-full"
                ),
              })}
            </div>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-medium dark:text-zinc-200">
              {title}
            </span>
            {subtitle && (
              <span className="text-left text-[10px] text-secondary-foreground">
                {subtitle}
              </span>
            )}
          </div>
          {typeof value === "string" ? (
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {value}
            </span>
          ) : (
            value
          )}
        </>
      )}
    </Component>
  )
}
