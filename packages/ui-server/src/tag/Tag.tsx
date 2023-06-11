import { cn } from "utils"

const variantStyles = {
  medium: "rounded-lg px-1.5 ring-1 ring-inset",
}

const colorStyles = {
  sky: {
    small: "text-sky-500 dark:text-sky-400",
    medium:
      "ring-sky-300 dark:ring-sky-400/30 bg-sky-400/10 text-sky-500 dark:text-sky-400",
  },
  emeral: {
    small: "text-emerald-500",
    medium:
      "ring-emerald-300 bg-emerald-400/10 text-emerald-500 dark:ring-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400",
  },
  amber: {
    small: "text-amber-500",
    medium:
      "ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
  },
  rose: {
    small: "text-red-500 dark:text-rose-500",
    medium:
      "ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400",
  },
  zinc: {
    small: "text-zinc-400 dark:text-zinc-500",
    medium:
      "ring-zinc-200 bg-zinc-50 text-zinc-500 dark:ring-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-400",
  },
}

type ValueColorMap = {
  [key: string]: string
  get: string
  post: string
  put: string
  delete: string
}

const valueColorMap: ValueColorMap = {
  get: "sky",
  post: "emerald",
  put: "amber",
  delete: "rose",
}
export function Tag({
  children,
  variant = "medium",
  color = valueColorMap[children.toLowerCase()] ?? "sky",
}: any) {
  return (
    <span
      className={cn(
        "font-mono text-[0.625rem] font-semibold leading-6",
        // @ts-expect-error
        variantStyles[variant],
        // @ts-expect-error
        colorStyles[color][variant]
      )}
    >
      {children}
    </span>
  )
}
