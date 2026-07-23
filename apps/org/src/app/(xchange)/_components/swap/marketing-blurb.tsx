"use client"

import Image from "next/image"

import { XIcon } from "@x7/icons"
import { useLocalStorage } from "@x7/ui"
import { LinkInternal } from "@x7/ui/link"
import { Tag } from "@x7/ui/tag"
import { getRandomPioneerNumber } from "@x7/utils"

export function MarketingBlurb({
  compactView = false,
}: {
  compactView?: boolean
}) {
  const [isHidden, setIsHidden] = useLocalStorage(
    "marketing-blurb-hidden",
    false
  )

  if (isHidden || compactView) return null

  return (
    <LinkInternal prefetch={true} href="/create">
      <div className="relative flex cursor-pointer items-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 text-white backdrop-blur-xs transition-colors hover:bg-zinc-800/50">
        <div className="-ml-3 shrink-0">
          <Image
            height={100}
            width={100}
            src={`https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png`}
            alt="Icon"
            className="zoom-in-75 h-20 w-20"
          />
        </div>
        <div className="flex-1 px-3 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-medium text-zinc-100">
              Launch instantly on Xchange &nbsp;
              <Tag variant="large" color="emerald">
                New
              </Tag>
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">
            Xchange provides instant liquidity for your token.
          </p>
        </div>
        <button
          className="absolute top-2 right-2 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
          onClick={(e) => {
            e.preventDefault()
            setIsHidden(true)
          }}
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </LinkInternal>
  )
}
