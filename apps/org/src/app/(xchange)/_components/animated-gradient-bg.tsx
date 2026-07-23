"use client"

import { cn } from "@x7/css"

interface AnimatedGradientBgProps {
  className?: string
  children: React.ReactNode
}

export function AnimatedGradientBg({
  className,
  children,
}: AnimatedGradientBgProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div className="absolute -inset-full animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(99,102,241,0.1)_360deg)]" />
        <div className="absolute inset-px rounded-2xl bg-zinc-950/90 backdrop-blur-xl" />
      </div>
      {children}
    </div>
  )
}

export function SubtleGlowBg({ className, children }: AnimatedGradientBgProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <div className="absolute -top-1/2 left-1/2 h-full w-full -translate-x-1/2 bg-linear-to-b from-indigo-500/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 left-1/2 h-full w-full -translate-x-1/2 bg-linear-to-t from-purple-500/5 via-transparent to-transparent blur-3xl" />
      </div>
      {children}
    </div>
  )
}
