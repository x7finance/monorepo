"use client"

import { Suspense, useEffect, useState } from "react"

import { cn } from "@x7/utils"

import { utilityNftData } from "./data"
import UtilityNftDetails from "./details"

export function UtitlityNfts() {
  const [isComponentReady, setComponentReady] = useState(false)

  useEffect(() => {
    setComponentReady(true)
  }, [])

  return (
    <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
      {utilityNftData?.map((n: { slug: string }) => {
        return (
          <li
            key={`utility-nft-${n.slug}`}
            className={cn(
              `group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 shadow-lg`
            )}
          >
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5  dark:bg-white/2.5 dark:ring-white/10"></div>
            {isComponentReady ? (
              <Suspense fallback={<NftLoadingShimmer />}>
                <UtilityNftDetails nft={n} />
              </Suspense>
            ) : (
              <NftLoadingShimmer />
            )}
          </li>
        )
      })}
    </ul>
  )
}

function NftLoadingShimmer() {
  return (
    <div className="shimmer-container">
      <div className="h-[460px] w-full animate-pulse bg-zinc-300"></div>
      <div className="h-[800px] w-full animate-pulse bg-zinc-200"></div>
    </div>
  )
}
