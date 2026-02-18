import Image from "next/image"
/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { formatEther, parseEther } from "viem"
import { useChainId, useReadContracts, useWriteContract } from "wagmi"

import { X7NFT } from "@x7/contracts"
import { cn } from "@x7/css"
import {
  BoxIcon,
  CheckCircleIcon,
  LayoutListIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@x7/icons"
import { Button } from "@x7/ui/button"
import type { ChainId } from "@x7/utils"
import { generateChainAbbreviation, LogCodes } from "@x7/utils"
import { env } from "~/env.mjs"
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink"
import { GradientTypes } from "~/lib/utils/gradients"
import { log } from "~/lib/utils/log"
import type { UtilityNftType } from "~/types"

export function UtilityNftDetails({ nft }: { nft: UtilityNftType }) {
  const chainId = useChainId() as ChainId
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mintCount, setMintCount] = useState(1)

  const { data } = useReadContracts({
    contracts: [
      {
        address: nft.contract,
        abi: X7NFT,
        functionName: "mintingOpen",
      },
      {
        address: nft.contract,
        abi: X7NFT,
        functionName: "mintPrice",
      },
      {
        address: nft.contract,
        abi: X7NFT,
        functionName: "maxSupply",
      },
      {
        address: nft.contract,
        abi: X7NFT,
        functionName: "totalSupply",
      },
    ],
  })

  const { data: _hash, writeContract } = useWriteContract()

  const price =
    data?.[1]?.result && !!data[0].result
      ? formatEther(data[1].result as bigint)
      : 0

  const maxSupply = data?.[2]?.result ? Number(data[2].result) : 0
  const totalSupply = data?.[3]?.result ? Number(data[3].result) : -1

  const mintNft = useCallback(
    (quantity: number) => {
      try {
        const priceValue = Number(price)

        if (quantity <= 0 && priceValue > 0) {
          toast.error("Please ensure you are minting at least 1 NFT")

          return
        }
        writeContract({
          address: nft.contract,
          abi: X7NFT,
          functionName: "mintMany",
          args: [quantity],
          value: parseEther(
            // @ts-expect-error: todo fix
            `${parseFloat(formatEther(data?.[1]?.result)) * quantity}`
          ),
        })
      } catch (error) {
        log.error(LogCodes.FAIL, `${error}`)
      }
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [data, price, writeContract]
  )

  return (
    <>
      <div>
        <Image
          height={200}
          width={200}
          priority={true}
          className="h-auto w-full animate-blur-in"
          src={`${env.NEXT_PUBLIC_ASSETS_URL}/images/nfts/${nft.slug}.gif`}
          alt="Utility NFT Image"
        />
      </div>

      <p
        className={cn(
          "relative mx-auto mt-3 flex h-8 text-2xl tracking-tight text-zinc-900 dark:text-zinc-100"
        )}
      >
        {nft.name}
      </p>
      <div
        className={cn(
          GradientTypes.x7,
          `mx-auto bg-linear-to-r bg-clip-text font-bold text-transparent`
        )}
      >
        {price ?? nft.price} {generateChainAbbreviation(chainId)}
      </div>
      <p
        className={cn(
          "xl:48 mt-3 h-48 px-3 text-sm text-secondary-foreground sm:h-60 md:h-48 lg:h-80"
        )}
      >
        {nft.description}
      </p>
      <div className="mt-2 px-4">
        <ul
          className={cn(
            "-my-2 h-40 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300 sm:h-48 md:h-48 lg:h-56"
          )}
        >
          {nft.benefits.map((b: string, idx: number) => (
            <li key={`${nft.slug}-${idx}-benefit`} className="flex w-full py-2">
              <CheckCircleIcon
                className={cn("h-6 w-6 flex-none text-emerald-500")}
              />
              <span className="ml-4 text-zinc-700 dark:text-zinc-300">{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bottom-1 mx-auto mb-0.5 flex w-full flex-col items-center justify-center">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`${getExplorerLink(chainId, nft.contract, ExplorerDataType.ADDRESS)}`}
          className="relative text-xs text-zinc-700 underline dark:text-zinc-300"
        >
          contract
        </a>
      </div>

      {/* if maxsupply is zero then hide the span else give the result as maxsupply - total supply*/}
      {maxSupply === 0 ? (
        ""
      ) : (
        <div
          className={
            "mb-4 mt-4 flex flex-col items-center justify-center sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6"
          }
        >
          <span
            className={`${
              maxSupply - totalSupply === 0
                ? "bg-red-500 hover:bg-red-200 dark:bg-red-800 dark:text-zinc-300 dark:hover:bg-red-700"
                : "bg-emerald-500 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-zinc-300 dark:hover:bg-emerald-700"
            } inline-flex items-center justify-center rounded-lg border border-transparent bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm`}
          >
            {maxSupply - totalSupply} left
          </span>
        </div>
      )}

      <div className="relative mt-auto border-t border-zinc-200 dark:border-zinc-800">
        <div className="relative -mt-px flex divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="relative flex w-0 flex-1">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${nft.exchanges[chainId ?? 1]}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg py-4 text-sm font-medium text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <LayoutListIcon className="h-5 w-5" aria-hidden="true" />
              <span className="ml-3">Trade</span>
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1 overflow-hidden">
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault()

                setDrawerOpen(!drawerOpen)
              }}
              className={cn(
                `relative inline-flex w-0 flex-1 cursor-pointer items-center justify-center rounded-br-lg bg-linear-to-r from-emerald-500 to-emerald-700 py-4 text-sm font-medium text-zinc-100 hover:from-violet-400 hover:to-sky-600`
              )}
            >
              <BoxIcon className="h-5 w-5 text-zinc-100" aria-hidden="true" />
              <span className="ml-3">
                {data?.[0] ? (drawerOpen ? `Close` : "Mint") : `Not Ready`}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          drawerOpen ? "h-32" : "h-0",
          "bg-zinc-200 transition-all duration-500 dark:bg-zinc-800"
        )}
      >
        <div className="mt-2 flex flex-col items-center justify-center px-4 text-sm">
          <p>How many would you like to mint?</p>
          <div
            className="isolate mt-3 inline-flex -space-x-px rounded-lg"
            aria-label="Mint Count"
          >
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault()

                setMintCount(mintCount - 1 < 1 ? 1 : mintCount - 1)
              }}
              className="relative inline-flex cursor-pointer items-center rounded-l-md border border-zinc-300 bg-white px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 focus:z-20"
            >
              <span className="sr-only">Subtract</span>
              <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <span className="relative z-10 inline-flex items-center border border-emerald-500 bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-600 focus:z-20">
              {mintCount}
            </span>

            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault()

                if (mintCount >= nft.maxMint) {
                  return toast.error(
                    "This is the max you can mint in a single transaction"
                  )
                }

                setMintCount(mintCount + 1)
                return
              }}
              className="relative inline-flex cursor-pointer items-center rounded-r-md border border-zinc-300 bg-white px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 focus:z-20"
            >
              <span className="sr-only">Add</span>
              <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex w-full items-center pl-4">
              <Button
                className="flex h-10 w-20 items-center"
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  e.preventDefault()

                  mintNft(mintCount)
                }}
              >
                Mint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
