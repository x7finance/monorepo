/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

import React, { useCallback, useEffect, useMemo, useState } from "react"

import type { ActiveChainId, Native, Token } from "@x7/utils"
import {
  Amount,
  CurrencyAmount,
  LogCodes,
  tryParseAmount,
  ZERO,
} from "@x7/utils"
import { XchangeV2PoolState } from "~/lib/systems/PoolFinder/types"
import { useXChangePool } from "~/lib/systems/PoolFinder/XchangeV2Pool"
import { log } from "~/lib/utils/log"

import { AddLiquidityForm } from "../../../liquidity/_components/add-liquidity-form"

export const AddLiquidityTab = ({
  token0,
  token1,
}: {
  token0: Token | Native
  token1: Token | Native
  chainId: ActiveChainId
}) => {
  const [independendField, setIndependendField] = useState(0)
  const [refetchCount, setRefetchCount] = useState(0)
  const { pool, poolState } = useXChangePool(token1, token0)

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: "", input1: "" })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    if (!token0 || !token1) {
      return [undefined, undefined]
    }

    return [
      tryParseAmount(input0, token0)?.wrapped ??
        Amount.fromRawAmount(token0, 0),
      tryParseAmount(input1, token1)?.wrapped ??
        Amount.fromRawAmount(token1, 0),
    ]
  }, [input0, input1, token0, token1])

  const noLiquidity = useMemo(() => {
    return pool?.reserve0?.equalTo(ZERO) && pool?.reserve1?.equalTo(ZERO)
  }, [pool])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      setIndependendField(0)
      if (poolState === XchangeV2PoolState.NOT_EXISTS || noLiquidity) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        setTypedAmounts({
          input0: value,
          input1: "",
        })
      }
    },
    [noLiquidity, pool, poolState, token0]
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      setIndependendField(1)
      if (poolState === XchangeV2PoolState.NOT_EXISTS || noLiquidity) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        setTypedAmounts({
          input0: "",
          input1: value,
        })
      }
    },
    [noLiquidity, pool, poolState, token1]
  )

  useEffect(() => {
    // Includes !!pool
    if (
      pool?.reserve0?.greaterThan(ZERO) &&
      pool?.reserve1?.greaterThan(ZERO) &&
      token0 &&
      token1
    ) {
      if (independendField === 0) {
        const parsedAmount = tryParseAmount(input0, token0)

        setTypedAmounts({
          input0,
          input1: parsedAmount
            ? CurrencyAmount.fromRawAmount(
                token1,
                parsedAmount.multiply(pool.reserve1).divide(pool.reserve0)
                  .quotient ?? 0
              ).toExact()
            : "",
        })
      }

      if (independendField === 1) {
        const parsedAmount = tryParseAmount(input1, token1)

        log.info(LogCodes.LIQUIDITY_ADD, "Pool created", {
          input0: parsedAmount
            ? CurrencyAmount.fromRawAmount(
                token0,
                parsedAmount.multiply(pool.reserve0).divide(pool.reserve1)
                  .quotient ?? 0
              ).toExact()
            : "",
          parsedAmount,
          r0: pool.reserve0,
          r1: pool.reserve1,
          pool,
        })

        setTypedAmounts({
          input0: parsedAmount
            ? CurrencyAmount.fromRawAmount(
                token0,
                parsedAmount.multiply(pool.reserve0).divide(pool.reserve1)
                  .quotient ?? 0
              ).toExact()
            : "",
          input1,
        })
      }
    }
  }, [independendField, pool, input0, input1, token0, token1])

  return (
    <div className="flex flex-col">
      <AddLiquidityForm
        input0={input0}
        input1={input1}
        onChangeToken0TypedAmount={onChangeToken0TypedAmount}
        onChangeToken1TypedAmount={onChangeToken1TypedAmount}
        token0={token0}
        token1={token1}
        poolState={poolState}
        refetchCount={refetchCount}
        parsedInput0={parsedInput0}
        parsedInput1={parsedInput1}
        pool={pool}
        setTypedAmounts={setTypedAmounts}
        setRefetchCount={setRefetchCount}
      />
    </div>
  )
}
