"use client"

import { ArrowRightIcon } from "@x7/icons"
import { LinkExternal } from "@x7/ui/link"

export function ClawLendBanner() {
  return (
    <LinkExternal
      href="https://clawlend.com"
      className="group relative block w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600"
    >
      <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-transparent to-red-500/10" />
      <div className="relative flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦞</span>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold text-white">
              ClawLend.com
            </span>
            <span className="text-xs text-zinc-400">
              Flash loans for agents
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white">
          <span className="hidden text-xs font-medium sm:inline">
            Learn more
          </span>
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </LinkExternal>
  )
}
