import type { SendTransactionReturnType } from "@wagmi/core"
/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useCallback, useMemo } from "react"
import type { Address } from "viem"
import { useSimulateContract, useWriteContract } from "wagmi"

import type { Amount, ChainId, Currency } from "@x7/utils"
import { gasMargin, LogCodes, Native, ZERO } from "@x7/utils"
import {
  ApprovalState,
  useTokenApproval,
} from "~/lib/hooks/approvals/useTokenApproval"
import type { LiquidityFees } from "~/lib/hooks/tokens/useGetAllUserTokens"
import { log } from "~/lib/utils/log"

import { getXchangeRouterContractConfig } from "../../config/getXchangeRouterContract"

interface UseRemoveLiquidityProps {
  token0: Currency | Native | undefined
  token1: Currency | Native | undefined
  chainId: ChainId
  liquidityRemoving: Amount<Currency> | undefined
  address: Address | undefined
  minAmount0: Amount<Currency | Native> | undefined
  minAmount1: Amount<Currency | Native> | undefined
  deadline: bigint | undefined
  ammInput: Amount<Currency> | undefined
  contract: Address | undefined
  fees: LiquidityFees
  mutation: {
    onSuccess: (data: SendTransactionReturnType) => void
    onError: (e: Error) => void
  }
}

export function useRemoveLiquidity({
  token0,
  token1,
  chainId,
  liquidityRemoving,
  address,
  minAmount0,
  minAmount1,
  deadline,
  ammInput,
  fees,
  contract,
  mutation,
}: UseRemoveLiquidityProps) {
  const [token0State] = useTokenApproval({
    amount: ammInput,
    spender: contract,
    enabled: true,
  })

  const isAmmApproved = useMemo(
    () =>
      token0State === ApprovalState.APPROVED ||
      token0?.equals(Native.onChain(chainId).wrapped),
    [token0, token0State, chainId]
  )

  const prepareNative = useCallback(() => {
    if (
      !token0 ||
      !token1 ||
      !liquidityRemoving ||
      !address ||
      !minAmount0 ||
      !minAmount1 ||
      !deadline ||
      !isAmmApproved
    ) {
      return undefined
    }

    if (minAmount0.equalTo(ZERO) || minAmount1.equalTo(ZERO)) {
      return undefined
    }

    const isToken0Native = token0.isNative
    const tokenAddress = isToken0Native
      ? token1.wrapped.address
      : token0.wrapped.address

    // minAmount0/1 already include the user's slippage tolerance
    // (slippageAmount(...) at the call site); do not apply an additional
    // hardcoded buffer — that double-counted slippage on the native path and
    // diverged from the ERC20-ERC20 path below.
    const tokenMinAmount = isToken0Native
      ? minAmount1.quotient
      : minAmount0.quotient
    const ethMinAmount = isToken0Native
      ? minAmount0.quotient
      : minAmount1.quotient

    const args = [
      tokenAddress,
      liquidityRemoving.quotient,
      tokenMinAmount,
      ethMinAmount,
      address,
      deadline,
    ] as const

    const routerContract = getXchangeRouterContractConfig(chainId)

    const hasFees =
      fees.token0.buyFeeBps > 0n ||
      fees.token0.sellFeeBps > 0n ||
      fees.token1.buyFeeBps > 0n ||
      fees.token1.sellFeeBps > 0n

    return {
      account: address,
      address: routerContract.address,
      chainId: chainId,
      abi: routerContract.abi,
      functionName: hasFees
        ? "removeLiquidityETHSupportingFeeOnTransferTokens"
        : "removeLiquidityETH",
      args,
    } as const
  }, [
    token0,
    token1,
    liquidityRemoving,
    address,
    minAmount0,
    minAmount1,
    deadline,
    fees,
    isAmmApproved,
    chainId,
  ])

  const prepareNonNative = useCallback(() => {
    if (
      !token0 ||
      !token1 ||
      !liquidityRemoving ||
      !address ||
      !minAmount0 ||
      !minAmount1 ||
      !deadline ||
      !isAmmApproved
    ) {
      return undefined
    }

    if (minAmount0.equalTo(ZERO) || minAmount1.equalTo(ZERO)) {
      return undefined
    }

    const args = [
      token0.wrapped.address,
      token1.wrapped.address,
      liquidityRemoving.quotient,
      minAmount0.quotient,
      minAmount1.quotient,
      address,
      deadline,
    ] as const

    const routerContract = getXchangeRouterContractConfig(chainId)

    return {
      account: address,
      address: routerContract.address,
      chainId: chainId,
      abi: routerContract.abi,
      functionName: "removeLiquidity",
      args,
    } as const
  }, [
    token0,
    token1,
    liquidityRemoving,
    address,
    minAmount0,
    minAmount1,
    deadline,
    isAmmApproved,
    chainId,
  ])

  const prepare = useMemo(() => {
    const isWithNative = token0?.isNative || token1?.isNative
    return isWithNative ? prepareNative() : prepareNonNative()
  }, [token0, token1, prepareNative, prepareNonNative])

  const { data: simulation } = useSimulateContract(
    prepare
      ? {
          // oxlint-disable-next-line @typescript-eslint/no-explicit-any -- wagmi useSimulateContract type inference requires cast for dynamic contract config
          ...(prepare as any),
          query: {
            enabled: Boolean(prepare),
          },
        }
      : { query: { enabled: false } }
  )

  const {
    writeContractAsync,
    writeContract: _,
    ...rest
  } = useWriteContract({
    mutation,
  })

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation) return undefined

    return async (confirm: () => void) => {
      try {
        await writeContractAsync({
          ...simulation.request,
          gas: simulation.request.gas
            ? gasMargin(simulation.request.gas)
            : undefined,
        })
        confirm()
      } catch (error) {
        log.error(LogCodes.FAIL, "Error removing liquidity: ", `${error}`)
      }
    }
  }, [writeContractAsync, simulation])

  return {
    ...rest,
    write,
  }
}
