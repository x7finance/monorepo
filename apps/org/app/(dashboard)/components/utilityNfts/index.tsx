"use client"

import { cn } from "utils"

import { Suspense, useEffect, useState } from "react"

import { utilityNftData } from "./data"
import UtilityNftDetails from "./details"

export function UtitlityNfts() {
  const [isComponentReady, setComponentReady] = useState(false)

  useEffect(() => {
    setComponentReady(true)
  }, [])

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 mt-8"
    >
      {utilityNftData?.map((n: any) => {
        return (
          <li
            key={`utility-nft-${n.slug}`}
            className={cn(
              `group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 shadow-lg`
            )}
          >
            <div className="ring-zinc-900/7.5 dark:bg-white/2.5 absolute inset-0 rounded-2xl ring-1  ring-inset dark:ring-white/10"></div>
            {isComponentReady ? (
              <Suspense fallback={<LoadingShimmer />}>
                <UtilityNftDetails nft={n} />
              </Suspense>
            ) : (
              <LoadingShimmer />
            )}
          </li>
        )
      })}
    </ul>
  )
}

const LoadingShimmer = () => (
  <div className="shimmer-container">
    <div className="w-full h-[460px] bg-zinc-300 animate-pulse"></div>
    <div className="w-full h-[800px] bg-zinc-200 animate-pulse"></div>
  </div>
)
