import type { ActiveChainId, Native, Token } from "@x7/utils"
import type { BaseError } from "viem"
import type { WriteContractErrorType } from "wagmi/actions"
import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens"

/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { UserRejectedRequestError } from "viem"
import { useAccount, useSimulateContract, useWriteContract } from "wagmi"

import { uniswapV2PairAbi } from "@x7/contracts"
import { CheckCircleIcon, PlusCircleIcon } from "@x7/icons"
import { X7ContractsEnum } from "@x7/sdk"
import { Button } from "@x7/ui/button"
import { CurrencyAmount } from "@x7/utils"
import { CurrencyInput } from "~/lib/components/utils/currency-input"
import { APPROVE_TAG_REMOVE } from "~/lib/constants/misc"
import { useTransactionStore } from "~/lib/providers/tx"
import { useWeb3Config } from "~/lib/providers/web3"
import { Checker } from "~/lib/systems/Checker"
import { CheckerProvider } from "~/lib/systems/Checker/Provider"

import { ConfirmLiquidityRemoval } from "../confirm-liquidity-removal"
import { LockedAmountsPoolInfoCard } from "../locked-amounts-pool-info-card"
import { RemoveSectionPoolInfoCard } from "../remove-section-pool-info-card"

export const SyncLiquidityTab = ({
  token0,
  token1,
  liquidityToken,
  position,
  chainId,
}: {
  token0: Token | Native
  token1: Token | Native
  liquidityToken: Token
  position: UserPositionsResponse
  chainId: ActiveChainId
}) => {
  const [remainingLiquidity, setRemainingLiquidity] = useState<number>()
  const [removingAmm, setRemovingAmm] = useState<CurrencyAmount<Token>>()
  const [token0Amt, setToken0Amt] = useState<CurrencyAmount<Token | Native>>()
  const [token1Amt, setToken1Amt] = useState<CurrencyAmount<Token | Native>>()
  const [refetchCount, setRefetchCount] = useState<number>(0)

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: "", input1: "" })

  const { address } = useAccount()
  const {
    mutate: { trackTransaction },
  } = useTransactionStore()
  const { wagmiConfig } = useWeb3Config()

  const { data } = useSimulateContract({
    config: wagmiConfig,
    address: position.contractAddress,
    abi: uniswapV2PairAbi,
    functionName: "sync",
  })

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message)
        }
      }

      if (hash) {
        trackTransaction({
          txHash: hash,
          type: "swap",
          summary: {
            pending: `Syncing Reserves`,
            completed: `Successfully synced reserves`,
            failed: `Something went wrong syncing reserves`,
          },
        })
      }
    },
    [address]
  )

  const { writeContract } = useWriteContract({
    mutation: {
      onSettled,
    },
  })

  useEffect(() => {
    if (!!token0 && !!token1 && !!liquidityToken) {
      const amountOfLiquidity = position.tokenBalance ?? 0n
      const _t0Amt = CurrencyAmount.fromRawAmount(
        token0,
        (BigInt(amountOfLiquidity) *
          (position.token0.balance! - position.token0.minimumBalance)) /
          position.liquidity!
      )

      const _t1Amt = CurrencyAmount.fromRawAmount(
        token1,
        (BigInt(amountOfLiquidity) *
          (position.token1.balance! - position.token1.minimumBalance)) /
          position.liquidity!
      )

      setToken0Amt(_t0Amt)
      setToken1Amt(_t1Amt)
      setRemovingAmm(
        CurrencyAmount.fromRawAmount(liquidityToken, amountOfLiquidity)
      )
      setRemainingLiquidity(0)

      setTypedAmounts({
        input0: `${_t0Amt.toFixed(6)}`,
        input1: `${_t1Amt.toFixed(6)}`,
      })
    }
  }, [token0, token1])

  const lockedAmount0 = position.token0.minimumBalance
  const lockedAmount1 = position.token1.minimumBalance

  return (
    <div className="flex flex-col">
      <div className="space-y-3 border-t-2 pt-5">
        <h3 className="text-sm text-muted-foreground">
          This pool has been flagged as needing to be re-synced
        </h3>
        <div className="text-xs leading-5 dark:text-zinc-500">
          This is because there is a price difference of greater than 20% and
          you own more than 75% of the pool. To do this, you will need to follow
          the steps listed below.
        </div>
      </div>

      <div className="space-y-3 pt-6">
        <h3 className="text-sm text-muted-foreground">
          1. Remove your postition
        </h3>
        <div className="text-xs leading-5 dark:text-zinc-500">
          Below is an estimation of how much of each token you will be
          withdrawing from the pool.
        </div>

        <div className="flex flex-col gap-4">
          <CurrencyInput
            id="remove-liquidity-token0"
            type="INPUT"
            className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
            chainId={chainId}
            value={input0}
            onChange={() => {}}
            onSelect={() => {}}
            currency={token0}
            disabled={true}
            loading={false}
            disableMaxButton={true}
            disableInsufficientBalanceError={true}
            refetchCounter={refetchCount}
          />
          <div className="left-0 right-0 mb-[-24px] mt-[-24px] flex items-center justify-center">
            <button
              type="button"
              className="z-10 rounded-full border border-accent bg-emerald-500/80 p-2 dark:bg-background"
            >
              <PlusCircleIcon
                strokeWidth={3}
                className="h-4 w-4 text-white dark:text-emerald-500"
              />
            </button>
          </div>
          <CurrencyInput
            id="remove-liquidity-token1"
            type="INPUT"
            className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
            chainId={chainId}
            value={input1}
            onChange={() => {}}
            onSelect={() => {}}
            currency={token1}
            disabled={true}
            loading={false}
            disableMaxButton={true}
            disableInsufficientBalanceError={true}
            refetchCounter={refetchCount}
          />
          {(lockedAmount0 > 0 || lockedAmount1 > 0) && (
            <LockedAmountsPoolInfoCard position={position} />
          )}
          <RemoveSectionPoolInfoCard
            position={position}
            input0={token0Amt}
            input1={token1Amt}
            remainingLiquidity={remainingLiquidity ?? 0}
          />
          <CheckerProvider>
            <Checker.Network fullWidth chainId={chainId}>
              <h3 className="mt-2 text-sm text-muted-foreground">
                2. Approve the removal of your liquidity from the pool.
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Checker.ApproveERC20
                    id="approve-amm-token"
                    className="whitespace-nowrap"
                    variant={"default"}
                    size="default"
                    fullWidth
                    amount={removingAmm}
                    contract={X7ContractsEnum.XchangeRouter(chainId)}
                  >
                    <Button
                      variant={"outline"}
                      icon={CheckCircleIcon}
                      iconPosition="end"
                      iconProps={{
                        className: "h-3 w-3 relative left-2 text-emerald-500",
                      }}
                      fullWidth
                    >
                      Approved Removal
                    </Button>
                  </Checker.ApproveERC20>
                </div>
                <h3 className="mt-4 text-sm text-muted-foreground">
                  3. Execute the removal of your liquidity from the pool.
                </h3>
              </div>

              <Checker.Success tag={APPROVE_TAG_REMOVE}>
                <ConfirmLiquidityRemoval
                  poolAddress={position.contractAddress}
                  contract={X7ContractsEnum.XchangeRouter(chainId)}
                  position={position}
                  chainId={chainId}
                  token0={token0}
                  token1={token1}
                  input0={token0Amt}
                  input1={token1Amt}
                  ammInput={removingAmm}
                  fees={{
                    token0: position.token0.fees,
                    token1: position.token1.fees,
                  }}
                  liquidityRemoving={removingAmm}
                  onSuccess={() => {
                    setTypedAmounts({ input0: "", input1: "" })
                    setRefetchCount(refetchCount + 1)
                  }}
                />
              </Checker.Success>
            </Checker.Network>
          </CheckerProvider>
          <h3 className="mt-4 text-sm text-muted-foreground">
            4. Once you have closed your position. Hit the Sync button below.
          </h3>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              if (writeContract) {
                // @ts-expect-error: todo fix
                writeContract(data?.request)
              }
            }}
          >
            Sync
          </Button>
          <h3 className="mt-4 text-sm text-muted-foreground">
            5. Once synced, You can re-open your position using the "Add
            Liquidity" tab above.
          </h3>
        </div>
      </div>
    </div>
  )
}
