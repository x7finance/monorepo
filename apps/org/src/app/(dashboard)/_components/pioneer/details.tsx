/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { formatEther } from "viem"
import { useAccount, useChainId, useReadContracts } from "wagmi"

import { X7Pioneer } from "@x7/contracts"
import { cn } from "@x7/css"
import { CheckCircleIcon, Glyph, IconWrapper, Loader2 } from "@x7/icons"
import { X7ContractsEnum } from "@x7/sdk"
import { Button, buttonVariants } from "@x7/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { LinkExternal } from "@x7/ui/link"
import { ChainId } from "@x7/utils"
import { ConnectionComponent } from "~/lib/components/utils/web3-connect-button"
import { usePioneerClaim } from "~/lib/hooks/pioneers/usePioneerClaim"
import { usePioneerUnlock } from "~/lib/hooks/pioneers/usePioneerUnlock"

export function useUnclaimedRewardsById(ids: number[]) {
  const chainId = useChainId() as ChainId
  const [unclaimedRewards, setUnclaimedRewards] = useState<Map<number, bigint>>(
    new Map()
  )

  const contractCalls = ids.map((id) => ({
    address: X7ContractsEnum.PioneerRewardPool(chainId),
    abi: X7Pioneer,
    functionName: "unclaimedRewards",
    args: [id],
  }))

  const { data, isFetched } = useReadContracts({
    // @ts-expect-error: todo check types
    contracts: contractCalls,
  })

  useEffect(() => {
    if (isFetched && data) {
      const rewardsMap = new Map<number, bigint>()
      data.forEach((result: any, index: number) => {
        const reward = BigInt((result?.result ?? 0) as bigint)
        const id = ids[index] ?? 0
        rewardsMap.set(id, reward)
      })
      setUnclaimedRewards(rewardsMap)
    }
  }, [data, isFetched, ids])

  return { unclaimedRewards, isFetched }
}

export function useUnlockedById(ids: number[]) {
  const chainId = useChainId() as ChainId
  const [isUnlocked, setIsUnlocked] = useState<Map<number, boolean>>(new Map())

  const contractCalls = ids.map((id) => ({
    address: X7ContractsEnum.PioneerRewardPool(chainId),
    abi: X7Pioneer,
    functionName: "transferUnlocked",
    args: [id],
  }))

  const { data, isFetched } = useReadContracts({
    // @ts-expect-error: todo check types
    contracts: contractCalls,
  })

  useEffect(() => {
    if (isFetched && data) {
      const unlockedMap = new Map<number, boolean>()
      data.forEach((result, index) => {
        const unlocked = Boolean(result.result ?? false)
        unlockedMap.set(ids[index] ?? 0, unlocked)
      })
      setIsUnlocked(unlockedMap)
    }
  }, [data, isFetched, ids])

  return { isUnlocked, isFetched }
}

export function PioneerDetails() {
  const [pioneerIds, setPioneerIds] = useState<number[]>([])
  const [pioneerId, setPioneerId] = useState<number>(0)
  const { unclaimedRewards, isFetched: rewardsFetched } =
    useUnclaimedRewardsById(pioneerIds)
  const { isUnlocked, isFetched: unlockedFetched } = useUnlockedById(pioneerIds)

  let totalUnclaimed = 0n
  if (rewardsFetched) {
    totalUnclaimed = Array.from(unclaimedRewards.values()).reduce(
      (acc, cur) => acc + cur,
      0n
    )
  }

  const { address, isConnected } = useAccount()
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [unlockFee, setUnlockFee] = useState<number>(0)
  const [poolBalance, setPoolBalance] = useState<string>("0.000")
  const chainId = useChainId() as ChainId

  const pioneerContracts = [
    {
      address: X7ContractsEnum.PioneerRewardPool(chainId),
      abi: X7Pioneer,
      functionName: "balanceOf",
      args: [address],
      chainId,
    },
    {
      address: X7ContractsEnum.PioneerRewardPool(chainId),
      abi: X7Pioneer,
      functionName: "lastETHBalance",
      chainId,
    },
    {
      address: X7ContractsEnum.PioneerRewardPool(chainId),
      abi: X7Pioneer,
      functionName: "transferUnlockFee",
      chainId,
    },
  ]

  const { data: pioneerData, isFetched: pioneerFetched } = useReadContracts({
    // @ts-expect-error: todo check types
    contracts: pioneerContracts,
  })

  useEffect(() => {
    if (pioneerFetched) {
      const walletBalance = pioneerData?.[0]?.result ?? 0
      const poolBalance = (pioneerData?.[1]?.result as bigint) ?? 0n
      const unlockFee = (pioneerData?.[2]?.result as bigint) ?? 0
      setWalletBalance(Number(walletBalance))
      setPoolBalance(parseFloat(formatEther(poolBalance)).toFixed(3))
      setUnlockFee(parseFloat(formatEther(unlockFee)))
    }
  }, [pioneerData, pioneerFetched])

  const pioneerIdContracts = Array.from(
    { length: walletBalance },
    (_, index) => ({
      address: X7ContractsEnum.PioneerRewardPool(chainId),
      abi: X7Pioneer,
      functionName: "tokenOfOwnerByIndex",
      args: [address, index],
      chainId,
    })
  )

  const { data: contractData, isFetched: pioneerIdFetched } = useReadContracts({
    // @ts-expect-error: todo check types
    contracts: pioneerIdContracts,
  })

  useEffect(() => {
    if (pioneerIdFetched) {
      const ids =
        contractData?.map((contract) => contract.result as number) ?? []
      setPioneerIds(ids)
    }
  }, [contractData, pioneerIdFetched])

  const {
    writeContract: writeContractClaim,
    data: claimData,
    isPending: claimPending,
  } = usePioneerClaim({ pioneerIds })

  const handleClaim = () => {
    if (claimData) {
      writeContractClaim(claimData.request)
    }
  }

  const {
    writeContract: writeContractUnlock,
    data: unlockData,
    isPending: unlockPending,
  } = usePioneerUnlock({ pioneerId, unlockFee })

  const handleUnlock = (id: number) => {
    setPioneerId(id)
    if (unlockData) {
      writeContractUnlock(unlockData.request)
    } else {
      toast.error(`Add ${0.07} ETH to unlock Pioneer ${id}`)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 px-3 sm:px-6">
        <CardTitle className="text-zinc-900 dark:text-zinc-100">
          Pioneer Pool
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {`Manage your Pioneer rewards.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-3 sm:px-6">
        {chainId !== ChainId.ETHEREUM ? (
          <div className="mt-4 flex flex-col items-center p-4">
            <div className="text-muted-foreground mb-3 text-center text-sm">
              Connect to the Ethereum network to see Pioneer Rewards
            </div>
            <div>
              <ConnectionComponent />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 border-t-2 pt-4">
              <div className="mt-4 divide-zinc-200 p-4 dark:divide-zinc-800">
                <div className="flex flex-col items-start">
                  <div className="mb-4 flex items-center">
                    <CheckCircleIcon className="h-6 w-6 flex-none text-emerald-500" />
                    <div className="ml-4 text-sm text-zinc-700 dark:text-zinc-300">
                      Pioneer Pool: <b>{poolBalance} ETH</b>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center">
                    <CheckCircleIcon className="h-6 w-6 flex-none text-emerald-500" />
                    <div className="ml-4 text-sm text-zinc-700 dark:text-zinc-300">
                      Transfer Unlock Fee: <b>{unlockFee} ETH</b>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center">
                    {Number(totalUnclaimed) === 0 ? (
                      <CheckCircleIcon className="mr-1 h-6 w-6 flex-none text-emerald-500" />
                    ) : (
                      <Loader2 className="mr-1 h-6 w-6 animate-spin text-emerald-500" />
                    )}
                    <div className="ml-4 text-sm text-zinc-700 dark:text-zinc-300">
                      Your Total Unclaimed Rewards:{" "}
                      <b>{formatEther(totalUnclaimed)} ETH</b>
                    </div>
                  </div>
                </div>
                <Button
                  loading={claimPending}
                  variant={"primary"}
                  disabled={
                    !isConnected ||
                    walletBalance === 0 ||
                    Number(totalUnclaimed) === 0
                  }
                  onClick={() => handleClaim()}
                  className="w-full"
                >
                  Claim All
                </Button>
              </div>
            </div>
            <div className="space-y-3 border-t-2 pt-4">
              <div className="text-md leading-none font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Your Pioneer NFTs
              </div>
              <div className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                You currently have <b>{walletBalance}</b> Pioneer NFT(s) in this
                wallet
              </div>
              <div>
                <div className="flex flex-col items-center py-4">
                  <div className="mb-2 w-full">
                    {pioneerIdFetched ? (
                      <table className="w-full">
                        <tbody>
                          {pioneerIds.map((id, index) => (
                            <tr
                              key={id}
                              className={cn(
                                "mb-8 border-zinc-200 dark:border-zinc-800",
                                {
                                  "border-t": index === 0,
                                  "border-b": true,
                                }
                              )}
                            >
                              <td className="flex flex-col py-2">
                                <div className="ml-2 flex flex-col gap-y-2">
                                  <div className="flex items-center">
                                    {Number(unclaimedRewards.get(id)) === 0 ? (
                                      <CheckCircleIcon className="mr-1 h-6 w-6 flex-none text-emerald-500" />
                                    ) : (
                                      <Loader2 className="mr-1 h-6 w-6 animate-spin text-emerald-500" />
                                    )}
                                    <div className="text-muted-foreground text-sm leading-none font-bold whitespace-nowrap">
                                      {`Pioneer ${id}`} -{" "}
                                      {unlockedFetched
                                        ? isUnlocked.get(id)
                                          ? "Unlocked"
                                          : "Locked"
                                        : "Loading..."}
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="text-muted-foreground text-sm leading-none">
                                      Unclaimed Rewards:&nbsp;
                                    </div>
                                    <div className="font-bold whitespace-nowrap">
                                      {rewardsFetched &&
                                      unclaimedRewards.has(id)
                                        ? `${formatEther(
                                            unclaimedRewards.get(id) ?? 0n
                                          )} ETH`
                                        : "Loading..."}{" "}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center gap-1">
                                  <Button
                                    loading={claimPending}
                                    size={"sm"}
                                    variant={"primary"}
                                    disabled={
                                      !isConnected ||
                                      Number(unclaimedRewards.get(id)) === 0
                                    }
                                    onClick={() => handleClaim()}
                                    className="ml-4"
                                  >
                                    Claim
                                  </Button>
                                  <Button
                                    size={"sm"}
                                    loading={unlockPending}
                                    variant={"border"}
                                    disabled={
                                      !unlockedFetched || isUnlocked.get(id)
                                    }
                                    onClick={() => handleUnlock(id)}
                                    className="ml-4"
                                  >
                                    Unlock
                                  </Button>
                                  <LinkExternal
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={`https://etherscan.io/nft/${X7ContractsEnum.PioneerRewardPool(chainId)}/${id}`}
                                    className="ml-4 flex cursor-pointer items-center gap-1"
                                  >
                                    <IconWrapper
                                      glyph={Glyph.etherscan}
                                      size={5}
                                    />
                                  </LinkExternal>
                                  <LinkExternal
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href={`https://pro.opensea.io/nft/ethereum//${X7ContractsEnum.PioneerRewardPool(chainId)}/${id}`}
                                    className="ml-4 flex cursor-pointer items-center gap-1"
                                  >
                                    <IconWrapper
                                      glyph={Glyph.opensea}
                                      size={5}
                                    />
                                  </LinkExternal>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="mt-2 flex justify-center">
                        <LinkExternal
                          href={`https://pro.opensea.io/collection/x7-pioneer`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({
                              variant: "default",
                            }),
                            "mt-2"
                          )}
                        >
                          Trade X7 Pioneer NFTs
                        </LinkExternal>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
