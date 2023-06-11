"use client"

import { ChainEnum, ContractsEnum, ONE_MILLION } from "common"
import { cn, generateChainAbbreviation, generateChainBase } from "utils"
import { Button } from "ui"
import {
  BoxIcon,
  ChainsArray,
  CheckCircleIcon,
  LayoutListIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "icons"
import { X7NFT } from "contracts"

import { useCallback, useState } from "react"
import Image from "next/image"
import { ConnectKitButton } from "connectkit"
import { formatEther, parseEther } from "viem"
import { useContractReads, useNetwork, useSwitchNetwork } from "wagmi"

import { useContractTx } from "@/lib/hooks/useContractTx"
import { toast } from "@/components/ui/use-toast"
import { GradientTypes } from "@/components/gradients"

export function UtitlityNfts() {
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
            <UtilityNftData nft={n} />
          </li>
        )
      })}
    </ul>
  )
}

function UtilityNftData({ nft }: any) {
  const { chain } = useNetwork()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mintCount, setMintCount] = useState(1)

  const { data } = useContractReads({
    contracts: [
      {
        address: nft.contract,
        abi: X7NFT as any,
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

  const { write: mintMany } = useContractTx(chain?.id, [
    {
      mode: "recklesslyUnprepared" as any,
      address: nft.contract as never,
      abi: X7NFT as never,
      functionName: "mintMany" as never,
    },
  ])

  const price =
    data?.[1]?.result && !!data?.[0]?.result
      ? // @ts-expect-error
        formatEther(data?.[1]?.result)
      : 0

  const maxSupply = !!data?.[2]?.result ? Number(data?.[2]?.result) : 0
  const totalSupply = !!data?.[3]?.result ? Number(data?.[3]?.result) : -1

  const mintNft = useCallback(
    async (quantity: number) => {
      try {
        // @ts-ignore
        if (quantity <= 0 && price > 0) {
          return toast({
            title: "Error",
            description: "Please ensure you are minting at least 1 NFT",
            variant: "destructive",
          })
        }

        if (!!mintMany) {
          await mintMany({
            gas: ONE_MILLION,
            args: [quantity],
            value: parseEther(
              `${parseFloat(formatEther(data?.[1]?.result as any)) * quantity}`
            ),
          })
        }
      } catch (error: any) {
        console.error(error)
      }
    },
    [data]
  )

  const { switchNetworkAsync } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    onError(error) {
      console.error(error)
    },
  })

  return (
    <>
      <div>
        <Image
          height={200}
          width={200}
          className="h-auto w-full"
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/images/nfts/${nft.slug}.gif`}
          alt="Utility NFT Image"
        />
      </div>

      <p
        className={cn(
          "relative mx-auto mt-3 flex h-8 text-2xl tracking-tight text-zinc-900 dark:text-zinc-100"
        )}
      >
        {nft?.name}
      </p>
      <div
        className={cn(
          GradientTypes.x7,
          `mx-auto bg-gradient-to-r bg-clip-text font-bold text-transparent`
        )}
      >
        {price ?? nft?.price} {generateChainAbbreviation(chain?.id)}
      </div>
      <p
        className={cn(
          "xl:48 mt-3 h-48 px-3 text-sm text-zinc-700 dark:text-zinc-400 sm:h-60 md:h-48 lg:h-80"
        )}
      >
        {nft?.description}
      </p>
      <div className="mt-2 px-4">
        <ul
          role="list"
          className={cn(
            "-my-2 h-40 divide-y divide-zinc-200 text-sm text-zinc-700 dark:divide-zinc-800 dark:text-zinc-300 sm:h-48 md:h-48 lg:h-56"
          )}
        >
          {nft?.benefits.map((b: any, idx: any) => (
            <li
              key={`${nft?.slug}-${idx}-benefit`}
              className="flex w-full py-2"
            >
              <CheckCircleIcon
                className={cn("h-6 w-6 flex-none text-violet-500")}
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
          href={`${generateChainBase(chain?.id)}/address/${nft.contract}`}
          className="relative text-xs text-zinc-700 underline dark:text-zinc-300"
        >
          contract
        </a>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          mint on other chains
        </p>
        <div className="flex flex-shrink-0 space-x-1">
          {ChainsArray.map((c, id) => (
            <ConnectKitButton.Custom key={`${id}-${c.id}`}>
              {({ isConnected, show }) => {
                return (
                  <button
                    onClick={async (e) => {
                      e.preventDefault()

                      if (!isConnected && show) {
                        show()
                        return
                      }
                      // @ts-ignore
                      await switchNetworkAsync(c?.id)
                    }}
                    key={`${nft.slug}-${id}-chain`}
                    className={cn(
                      chain?.id === c?.id
                        ? ``
                        : `grayscale transition-all duration-200 hover:grayscale-0`,
                      "cursor-pointer"
                    )}
                  >
                    <span>{c.icon}</span>
                  </button>
                )
              }}
            </ConnectKitButton.Custom>
          ))}
        </div>
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
                : "bg-green-500 hover:bg-green-200 dark:bg-green-800 dark:text-zinc-300 dark:hover:bg-green-700"
            } inline-flex items-center justify-center
            rounded-md border border-transparent bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700
          shadow-sm`}
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
              href={`${nft?.exchanges[chain?.id ?? 1]}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg py-4 text-sm font-medium text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <LayoutListIcon className="h-5 w-5 " aria-hidden="true" />
              <span className="ml-3">Trade</span>
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1 overflow-hidden">
            <a
              onClick={(e) => {
                e.preventDefault()

                setDrawerOpen(!drawerOpen)
              }}
              className={cn(
                `relative inline-flex w-0 flex-1 cursor-pointer items-center justify-center rounded-br-lg bg-gradient-to-r from-violet-500 to-violet-700 py-4 text-sm font-medium text-zinc-100 hover:from-violet-400 hover:to-sky-600`
              )}
            >
              <BoxIcon className="h-5 w-5 text-zinc-100" aria-hidden="true" />
              <span className="ml-3">
                {data?.[0] ? (drawerOpen ? `Close` : "Mint") : `Not Ready`}
              </span>
            </a>
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
            className="isolate mt-3 inline-flex -space-x-px rounded-md"
            aria-label="Mint Count"
          >
            <a
              onClick={(e) => {
                e.preventDefault()

                setMintCount(mintCount - 1 < 1 ? 1 : mintCount - 1)
              }}
              className="relative inline-flex cursor-pointer items-center rounded-l-md border border-zinc-300 bg-white px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 focus:z-20"
            >
              <span className="sr-only">Subtract</span>
              <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
            </a>

            <span className="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-lg font-bold text-indigo-600 focus:z-20">
              {mintCount}
            </span>

            <a
              onClick={(e) => {
                e.preventDefault()

                if (mintCount >= nft.maxMint) {
                  return toast({
                    title: "Error",
                    description:
                      "This is the max you can mint in a single transaction",
                    variant: "destructive",
                  })
                }

                setMintCount(mintCount + 1)
              }}
              className="relative inline-flex cursor-pointer items-center rounded-r-md border border-zinc-300 bg-white px-2 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 focus:z-20"
            >
              <span className="sr-only">Add</span>
              <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <div className="flex w-full items-center pl-4">
              <Button
                className="flex h-10 w-20 items-center"
                onClick={async (e: any) => {
                  e.preventDefault()

                  await mintNft(mintCount)
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

const EXCHANGE_IDS = {
  EcosystemMaxi: {
    openSea: "x7-ecosystem-maxi",
  },
  LiquidityMaxi: {
    openSea: "x7-liquidity-maxi",
  },
  DexMaxi: {
    openSea: "x7-dex-maxi",
  },
  BorrowingMaxi: {
    openSea: "x7-borrowing-maxi",
  },
  Magister: {
    openSea: "x7-magister",
  },
}

const utilityNftData = [
  {
    name: "Liquidity MAXI",
    price: "0.75 ETH",
    maxMint: 4,
    slug: "liquidity-maxi",
    contract: ContractsEnum.LiquidityMaxi,
    objective: "Arbitrage optimizer",
    description:
      "Liquidity Maxi NFTs are designed to provide added insurance to larger price movements. Ownership is for those who aim to preserve as much capital as possible while trading.",
    benefits: [
      "50% fee discount on X7100",
      "25% fee discount on X7R",
      "15% fee discount on X7DAO",
    ],
    denomination: {
      [ChainEnum.erc]: `ETH`,
      [ChainEnum.bsc]: `BNB`,
      [ChainEnum.optimism]: `ETH`,
      [ChainEnum.polygon]: `MATIC`,
      [ChainEnum.arbitrum]: `ETH`,
    },
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.LiquidityMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },
  {
    name: "Ecosystem MAXI",
    price: "0.3 ETH",
    maxMint: 5,
    slug: "ecosystem-maxi",
    contract: ContractsEnum.EcosystemMaxi,
    objective: "Lower fees on trades",
    description:
      "Ecosystem Maxi NFTs are for your everyday X7 maximalist. Ownership will provide traders with added flexibility during their trading experience between trading pairs.",
    benefits: [
      "25% fee discount on X7100",
      "10% fee discount on X7DAO and X7R",
    ],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.EcosystemMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },

  {
    name: "Borrowing MAXI",
    price: "2 ETH",
    maxMint: 2,
    slug: "borrowing-maxi",
    contract: ContractsEnum.BorrowingMaxi,
    objective: "Borrow at lower costs",
    description:
      "Borrowing Maxi NFTs will provide borrowers within our ILO Dex platform a significant advantage in their loan terms. Owning this NFT will reduce overall risk for lenders and borrowers while simultaneously allowing easier liquidity acquisition for DeFi entrepreneurs.",
    benefits: [
      "10% loan origination fee reduction",
      "20% loan premium discount",
    ],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.BorrowingMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },
  {
    name: "DEX MAXI",
    price: "1.5 ETH",
    slug: "dex-maxi",
    maxMint: 3,
    contract: ContractsEnum.DexMaxi,
    objective: "Lower costs on Xchange",
    description:
      "Dex Maxi NFTs provide users of our Dex an additional layer of flexibility during trading. Dex users will find this NFT useful towards a more frictionless trading experience.",
    benefits: ["50% discount on DEX LP fee"],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.DexMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },
  {
    name: "MAGISTER",
    slug: "magister",
    price: "50 ETH",
    maxMint: 1,
    contract: ContractsEnum.Magister,
    objective: "Veto power in DAO votes",
    description: `MAGISTER NFTs are designed to give investors responsible access to higher DAO voting privileges. Providing this ensures a proper array of checks and balances to the ecosystem. The MAGISTER NFTs also provide owners with the similar high tier benefits of Ecosystem, Liquidity, Dex and Borrower Maxi NFTs.`,
    benefits: [
      "Majority MAGISTER vote overrides 50-75% DAO vote",
      "50% discount on DEX LP fee",
      "20% loan origination fee reduction",
    ],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.Magister.openSea}`,
    },
  },
]
