/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unused-vars */

"use client";

import type { ReactNode } from "react";
import React, { useState } from "react";

import { cn } from "@x7/css";
import { ArrowRightIcon } from "@x7/icons";

import type {
  ExtractProps,
  IconComponent,
  PolymorphicComponentProps,
} from "../types";

interface Props {
  disabled?: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  hoverIcon?: IconComponent;
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  hoverIconProps?: any;
}

export type ListMenuItemProps<
  P extends React.ElementType,
  C extends React.ElementType,
> = {
  icon?: P;
  iconProps?: ExtractProps<P> & {
    width?: number;
    height?: number;
    className?: string;
  };
} & PolymorphicComponentProps<C, Props>;

export type ListMenuItemComponent = <
  P extends React.ElementType = "svg",
  C extends React.ElementType = "button",
>(
  props: ListMenuItemProps<P, C>,
) => React.ReactElement | null;

export const ListMenuItem: ListMenuItemComponent = ({
  as,
  icon: Icon,
  iconProps,
  subtitle,
  title,
  onClick,
  hoverIcon: HoverIcon,
  hoverIconProps,
  className,
  disabled = false,
  ...rest
}) => {
  const Component = as ?? "button";

  const [hover, setHover] = useState(false);

  const { ref, ...otherProps } = hoverIconProps;

  return (
    <Component
      {...rest}
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className={cn(
        className,
        disabled ? "pointer-events-none! cursor-default opacity-40" : "",
        subtitle ? "items-start" : "items-center",
        "hover:bg-muted relative flex w-full cursor-pointer gap-4 rounded-xl px-4 py-3",
      )}
    >
      {Icon && (
        <div
          style={{
            minWidth: iconProps?.width ?? 18,

            minHeight: iconProps?.height ?? 18,
            paddingTop: subtitle ? 1 : 0,
          }}
        >
          {React.createElement(Icon, {
            ...iconProps,
            width: 18,
            height: 18,
            strokeWidth: 2,

            className: cn(iconProps?.className, "text-emerald-500"),
          })}
        </div>
      )}
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
          {title}
        </span>
        {subtitle && (
          <span className="text-muted-foreground text-left text-sm font-normal">
            {subtitle}
          </span>
        )}
      </div>

      <div className="absolute top-0 right-0 bottom-0 flex items-center justify-center">
        <ArrowRightIcon
          {...otherProps}
          width={hoverIconProps?.width ?? 24}
          height={hoverIconProps?.height ?? 24}
          strokeWidth={hoverIconProps?.strokeWidth ?? 5}
          fill="currentColor"
          className={cn(hoverIconProps?.className, "text-emerald-500")}
        />
      </div>
    </Component>
  );
};
