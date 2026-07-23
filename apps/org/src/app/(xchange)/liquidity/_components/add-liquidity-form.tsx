/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import { useChainId } from "wagmi"

import { CheckCircleIcon, PlusCircleIcon } from "@x7/icons"
import { X7ContractsEnum } from "@x7/sdk"
import { Button } from "@x7/ui/button"
import type { ChainId, Currency, CurrencyAmount } from "@x7/utils"
import { CurrencyInput } from "~/lib/components/utils/currency-input"
import { APPROVE_TAG_ADD_LEGACY } from "~/lib/constants/misc"
import { Checker } from "~/lib/systems/Checker"
import { CheckerProvider } from "~/lib/systems/Checker/Provider"
import { XchangeV2PoolState } from "~/lib/systems/PoolFinder/types"

import { AddLiquidityStatCard } from "../../_components/liquidity/add-liquidity-share-card"
import { ConfirmLiquidityAdd } from "../../_components/liquidity/confirm-liquidity-add"

interface AddLiquidityFormProps {
  input0: string
  input1: string
  onChangeToken0TypedAmount: (value: string) => void
  onChangeToken1TypedAmount: (value: string) => void
  _setToken0?: (currency: Currency) => void
  _setToken1?: (currency: Currency) => void
  token0: Currency | undefined
  token1: Currency | undefined
  poolState: XchangeV2PoolState
  refetchCount: number
  parsedInput0: CurrencyAmount<Currency> | undefined
  parsedInput1: CurrencyAmount<Currency> | undefined
  pool: any // Replace 'any' with the actual pool type if available
  setTypedAmounts: (amounts: { input0: string; input1: string }) => void
  setRefetchCount: (count: number) => void
}

export function AddLiquidityForm(props: AddLiquidityFormProps) {
  const {
    input0,
    input1,
    onChangeToken0TypedAmount,
    onChangeToken1TypedAmount,
    _setToken0,
    _setToken1,
    token0,
    token1,
    poolState,
    refetchCount,
    parsedInput0,
    parsedInput1,
    pool,
    setTypedAmounts,
    setRefetchCount,
  } = props

  const chainId = useChainId() as ChainId

  return (
    <div className="space-y-3 border-t-2 pt-4">
      <h3 className="text-sm text-muted-foreground">
        1. Set the amount of tokens you'd like to add to the liquidity pool
      </h3>
      <div className="flex flex-col gap-4">
        <CurrencyInput
          id="add-liquidity-token0"
          type="INPUT"
          className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
          chainId={chainId}
          value={input0}
          onChange={onChangeToken0TypedAmount}
          onSelect={_setToken0}
          currency={token0}
          disabled={
            !token0 ||
            poolState === XchangeV2PoolState.LOADING ||
            poolState === XchangeV2PoolState.INVALID
          }
          loading={poolState === XchangeV2PoolState.LOADING}
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
          id="add-liquidity-token1"
          type="INPUT"
          className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
          chainId={chainId}
          value={input1}
          onChange={onChangeToken1TypedAmount}
          onSelect={_setToken1}
          currency={token1}
          disabled={
            !token1 ||
            poolState === XchangeV2PoolState.LOADING ||
            poolState === XchangeV2PoolState.INVALID
          }
          loading={poolState === XchangeV2PoolState.LOADING}
          refetchCounter={refetchCount}
        />
        <h3 className="mt-4 text-sm text-muted-foreground">
          2. Review the price of the tokens the liquidity pool will be once you
          add liquidity.
        </h3>
        <AddLiquidityStatCard
          pool={pool}
          poolState={poolState}
          input0={parsedInput0}
          input1={parsedInput1}
        />
        <CheckerProvider>
          <Checker.Network fullWidth chainId={chainId}>
            <Checker.Amounts
              fullWidth
              chainId={chainId}
              amounts={[parsedInput0, parsedInput1]}
            >
              <>
                <h3 className="mt-2 text-sm text-muted-foreground">
                  3. Approve the tokens to be added to the liquidity pool.
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Checker.ApproveERC20
                      id="approve-token-0"
                      className="whitespace-nowrap"
                      fullWidth
                      variant={"default"}
                      size="default"
                      amount={parsedInput0}
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
                        Approved {token0?.symbol}
                      </Button>
                    </Checker.ApproveERC20>
                    <Checker.ApproveERC20
                      id="approve-token-1"
                      className="whitespace-nowrap"
                      fullWidth
                      variant={"default"}
                      size="default"
                      amount={parsedInput1}
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
                        Approved {token1?.symbol}
                      </Button>
                    </Checker.ApproveERC20>
                  </div>
                  <h3 className="mt-4 text-sm text-muted-foreground">
                    4. Finalize the addition of liquidity to the pool.
                  </h3>
                  <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                    <ConfirmLiquidityAdd
                      poolAddress={pool?.liquidityToken?.address}
                      poolState={poolState}
                      chainId={chainId}
                      token0={token0}
                      token1={token1}
                      contract={X7ContractsEnum.XchangeRouter(chainId)}
                      input0={parsedInput0}
                      input1={parsedInput1}
                      onSuccess={() => {
                        setTypedAmounts({ input0: "", input1: "" })
                        setRefetchCount(refetchCount + 1)
                      }}
                    />
                  </Checker.Success>
                </div>
              </>
            </Checker.Amounts>
          </Checker.Network>
        </CheckerProvider>
      </div>
    </div>
  )
}
