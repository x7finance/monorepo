/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { cn } from "@x7/css";

const variantStyles = {
  medium: "rounded-lg px-1.5 ring-1 ring-inset text-[0.625rem]",
  large: "rounded-lg px-2 py-1 ring-1 ring-inset text-[12px]",
} as const;

const colorStyles = {
  sky: {
    small: "text-sky-500 dark:text-sky-400",
    medium:
      "ring-sky-300 dark:ring-sky-400/30 bg-sky-400/10 text-sky-500 dark:text-sky-400",
    large:
      "ring-sky-300 dark:ring-sky-400/30 bg-sky-400/10 text-sky-500 dark:text-sky-400",
  },
  emerald: {
    small: "text-emerald-500",
    medium:
      "ring-emerald-300 bg-emerald-400/10 text-emerald-500 dark:ring-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400",
    large:
      "ring-emerald-300 bg-emerald-400/10 text-emerald-500 dark:ring-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400",
  },
  amber: {
    small: "text-amber-500",
    medium:
      "ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
    large:
      "ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
  },
  rose: {
    small: "text-red-500 dark:text-rose-500",
    medium:
      "ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400",
    large:
      "ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400",
  },
  zinc: {
    small: "text-zinc-400 dark:text-zinc-500",
    medium:
      "ring-zinc-200 bg-zinc-50 text-zinc-500 dark:ring-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-400",
    large:
      "ring-zinc-200 bg-zinc-50 text-zinc-500 dark:ring-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-400",
  },
} as const;

const valueColorMap = {
  get: "sky",
  post: "emerald",
  put: "amber",
  delete: "rose",
} as const;

type VariantType = keyof typeof variantStyles;
type ColorType = keyof typeof colorStyles;
type ValueColorType = keyof typeof valueColorMap;

interface TagProps {
  children: React.ReactNode;
  variant?: VariantType;
  color?: ColorType | ValueColorType;
}

export function Tag({
  children = "",
  variant = "medium",
  color = "sky",
}: TagProps) {
  const childrenString =
    typeof children === "string" ? children.toLowerCase() : "";
  const resolvedColor = (valueColorMap[childrenString as ValueColorType] ||
    color) as ColorType;

  return (
    <span
      className={cn(
        "font-semibold leading-6",
        variantStyles[variant],
        colorStyles[resolvedColor][variant],
      )}
    >
      {children}
    </span>
  );
}
