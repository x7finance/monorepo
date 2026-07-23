"use client"

import { useEffect, useState } from "react"
import { useAccount, useBlockNumber, useChainId, useGasPrice } from "wagmi"

import { cn } from "@x7/css"
import { CogIcon } from "@x7/icons"
import { LinkInternal } from "@x7/ui/link"
import type { ChainId } from "@x7/utils"
import { ONE_BILLION } from "@x7/utils"
import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency"
import { useChainedNativePrice } from "~/lib/hooks/prices/useChainedNativePrice"
import { useWeb3Config } from "~/lib/providers/web3"
import { useSlideOverStore } from "~/lib/stores/slide-over"

import { ConnectionComponent } from "../utils/web3-connect-button"

const messages = [
  <span key={"footer-news-1"}>
    Announcing 0xTraderAI on Xchange&nbsp;
    <LinkInternal
      prefetch={true}
      target="_blank"
      href="/blog/public/posts/trader-ai"
      className="font-bold underline hover:text-blue-300"
    >
      Read &rarr;
    </LinkInternal>
  </span>,
  <span key={"footer-news-2"}>
    X7 Liquidity Lending Pair Explained&nbsp;
    <LinkInternal
      prefetch={true}
      target="_blank"
      href="/blog/public/posts/x7-intial-liquidity-lending-pair-explained"
      className="font-bold underline hover:text-blue-300"
    >
      Learn More &rarr;
    </LinkInternal>
  </span>,
  <span key={"footer-news-3"}>
    The Case For Decentralization&nbsp;
    <LinkInternal
      prefetch={true}
      target="_blank"
      href="/blog/public/posts/the-case-for-decentralization"
      className="font-bold underline hover:text-blue-300"
    >
      Read &rarr;
    </LinkInternal>
  </span>,
]

export function FooterNews() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        setIsAnimating(false)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden h-full items-center justify-center lg:flex">
      <div className="relative flex h-full items-center overflow-hidden">
        <div
          className={cn(
            `transform transition-all duration-500 ease-in-out ${
              isAnimating
                ? "translate-y-[100%] opacity-0"
                : "translate-y-0 opacity-100"
            }`
          )}
        >
          <div className="flex h-6 items-center justify-center text-center text-xs">
            {messages[currentMessageIndex]}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FooterSettingsButton() {
  const setIsSlideOverOpen = useSlideOverStore(
    (state) => state.setIsSlideOverOpen
  )

  const { address, isConnected } = useAccount()

  if (!isConnected || !address) {
    return <ConnectionComponent data-iscog={true} />
  }

  return (
    <button
      className="flex items-center gap-x-1 px-4 py-4 transition-opacity hover:opacity-80"
      onClick={() => setIsSlideOverOpen(true)}
    >
      <CogIcon className="h-4 w-4" />
    </button>
  )
}

export function FooterGwei() {
  const { wagmiConfig: config } = useWeb3Config()
  const {
    data: gasData,
    isLoading: gasLoading,
    isFetching: gasFetching,
    isRefetching: gasRefetching,
  } = useGasPrice({ config })

  const isGasLoading = gasLoading || gasFetching || gasRefetching

  const gwei = (Number(gasData?.toString()) / ONE_BILLION).toFixed(1)

  return !isGasLoading && !!gwei ? (
    `${gwei}`
  ) : (
    <div className="h-4 animate-pulse rounded-lg bg-zinc-300 dark:bg-zinc-700" />
  )
}

export function FooterBlockNumber() {
  const { wagmiConfig: config } = useWeb3Config()
  const {
    data: blockData,
    isLoading: blockLoading,
    isFetching: blockFetching,
    isRefetching: blockRefetching,
  } = useBlockNumber({ config })

  const isBlockLoading = blockLoading || blockFetching || blockRefetching

  return (
    <div className="w-16 tracking-tight text-black dark:text-white">
      {!isBlockLoading && !!blockData ? (
        `${blockData}`
      ) : (
        <div className="h-4 animate-pulse rounded-lg bg-zinc-300 dark:bg-zinc-700" />
      )}
    </div>
  )
}

export function FooterNativePrice() {
  const chainId = useChainId() as ChainId

  const {
    data: priceData,
    isLoading: priceLoading,
    isFetching: priceFetching,
    isRefetching: priceRefetching,
  } = useChainedNativePrice({ chainId })

  const { symbol } = useNativeCurrency({ chainId })

  const isPriceLoading = priceLoading || priceFetching || priceRefetching

  const nativePrice = priceData
    ? (Number(priceData) / 1e18).toFixed(2)
    : "- - -"

  return (
    <li className="mt-0 mb-0 flex items-center text-xs whitespace-nowrap last:mr-0 lg:mr-4">
      <span className="text-muted-foreground mr-2 text-[10px] uppercase">
        {symbol}
      </span>
      <div>
        <div className="mr-2 w-[55px] tracking-tight text-black dark:text-white">
          {!isPriceLoading && nativePrice !== "- - -" ? (
            <>
              <span className="text-muted-foreground mr-0.5 text-[10px] leading-3">
                $
              </span>
              {nativePrice}
            </>
          ) : (
            <div className="h-4 animate-pulse rounded-lg bg-zinc-300 dark:bg-zinc-700" />
          )}
        </div>
      </div>
    </li>
  )
}
