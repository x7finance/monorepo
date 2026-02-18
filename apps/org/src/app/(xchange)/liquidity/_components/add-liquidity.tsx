/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable react-hooks/rules-of-hooks */
"use client"

import type { Dispatch, FC, SetStateAction } from "react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useChainId } from "wagmi"

import type { Pair } from "@x7/sdk"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { LinkInternal } from "@x7/ui/link"
import type { ChainId, Currency } from "@x7/utils"
import { Amount, CurrencyAmount, Native, tryParseAmount, ZERO } from "@x7/utils"
import { X7R } from "~/lib/constants/tokens"
import { XchangeV2PoolState } from "~/lib/systems/PoolFinder/types"
import { useXChangePool } from "~/lib/systems/PoolFinder/XchangeV2Pool"

import { AddLiquidityForm } from "./add-liquidity-form"

export function AddLiquidity() {
  const chainId = useChainId() as ChainId

  const [token0, setToken0] = useState<Currency | Native | undefined>(
    Native.onChain(chainId)
  )
  const [token1, setToken1] = useState<Currency | Native | undefined>(X7R)

  const { pool, poolState } = useXChangePool(token1!, token0!)

  useEffect(() => {
    setToken0(Native.onChain(chainId))
  }, [chainId])

  return (
    <_Add
      pool={pool!}
      poolState={poolState}
      token0={token0}
      token1={token1}
      setToken0={setToken0}
      setToken1={setToken1}
    />
  )
}

interface AddProps {
  pool: Pair
  poolState: XchangeV2PoolState
  token0: Currency | Native | undefined
  token1: Currency | Native | undefined
  setToken0: Dispatch<SetStateAction<Currency | Native | undefined>>
  setToken1: Dispatch<SetStateAction<Currency | Native | undefined>>
}

const _Add: FC<AddProps> = ({
  pool,
  poolState,
  token0,
  token1,
  setToken0,
  setToken1,
}) => {
  const [independendField, setIndependendField] = useState(0)
  const [refetchCount, setRefetchCount] = useState(0)

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

  const _setToken0 = useCallback(
    (token: Currency | Native | undefined) => {
      if (token?.id === token1?.id) {
        return
      }
      setIndependendField(1)
      setTypedAmounts((prev) => ({ ...prev, input0: "" }))
      setToken0(token)
      setRefetchCount(refetchCount + 1)
    },
    [setToken0, token1]
  )

  const _setToken1 = useCallback(
    (token: Currency | Native | undefined) => {
      if (token?.id === token0?.id) {
        return
      }
      setIndependendField(0)
      setTypedAmounts((prev) => ({ ...prev, input1: "" }))
      setToken1(token)
      setRefetchCount(refetchCount + 1)
    },
    [setToken1, token0]
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
    <>
      <Card className="mx-auto mt-6 max-w-2xl">
        <CardHeader className="space-y-1 px-3 sm:px-6">
          <CardTitle className="text-zinc-900 dark:text-zinc-100">
            Create Liquidity Position
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {`Create a new Xchange pool or create a liquidity position on an existing Xchange pool.`}
            <LinkInternal
              prefetch={true}
              href={"/docs"}
              target="_blank"
              className="text-zinc-700 dark:text-zinc-300"
            >
              {` `}Learn More{` `}
              &#8594;
            </LinkInternal>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 px-3 sm:px-6">
          <AddLiquidityForm
            input0={input0}
            input1={input1}
            onChangeToken0TypedAmount={onChangeToken0TypedAmount}
            onChangeToken1TypedAmount={onChangeToken1TypedAmount}
            _setToken0={_setToken0}
            _setToken1={_setToken1}
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
        </CardContent>
      </Card>
    </>
  )
}
