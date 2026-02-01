/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

import type { Pair } from "@x7/sdk"
import type { Amount, Currency, Native } from "@x7/utils"
import type { FC } from "react"
import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens"

import { useMemo } from "react"

import { Card, CardContent } from "@x7/ui/card"
import { Collapsible } from "@x7/ui/radix-collapsible"
import { Stat, StatLabel, StatValue } from "@x7/ui/stat"
import { formatPercent } from "@x7/utils"
import { XchangeV2PoolState } from "~/lib/systems/PoolFinder/types"

interface AddLiquidityStatCard {
  pool: Pair
  poolState: XchangeV2PoolState
  input0: Amount<Currency | Native> | undefined
  input1: Amount<Currency | Native> | undefined
  position?: UserPositionsResponse
}

export const AddLiquidityStatCard: FC<AddLiquidityStatCard> = ({
  pool,
  poolState,
  input0,
  input1,
  position,
}) => {
  const [token0Input, token1Input] = useMemo(() => {
    if (!pool && poolState === XchangeV2PoolState.NOT_EXISTS)
      return [input0, input1]

    if (!pool || !input0 || !input1) return [undefined, undefined]

    return [
      input0.currency.wrapped.id === pool.token0.id
        ? input0.wrapped
        : input1.wrapped,
      input1.currency.wrapped.id === pool.token1.id
        ? input1.wrapped
        : input0.wrapped,
    ]
  }, [pool, poolState, input0, input1])

  const [token1Per0, token0Per1] = useMemo(() => {
    if (
      !token0Input ||
      !token1Input ||
      token0Input.equalTo(0) ||
      token1Input.equalTo(0)
    )
      return [undefined, undefined]

    const token1Per0 = token1Input
      .divide(token0Input)
      .multiply(10n ** BigInt(token0Input.currency.decimals))
      .toFixed(4)

    const token0Per1 = token0Input
      .divide(token1Input)
      .multiply(10n ** BigInt(token1Input.currency.decimals))
      .toFixed(4)

    return [token1Per0, token0Per1]
  }, [token0Input, token1Input])

  const poolShare = useMemo(() => {
    if (poolState === XchangeV2PoolState.NOT_EXISTS) return 1

    if (!pool || !token0Input || token0Input.equalTo(0)) return 0

    if (position) {
      return (
        (Number(token0Input.quotient) + Number(position?.token0.balance)) /
        (Number(pool.reserve0.quotient) + Number(token0Input.quotient))
      )
    }

    return (
      Number(token0Input.quotient) /
      (Number(pool.reserve0.quotient) + Number(token0Input.quotient))
    )
  }, [poolState, pool, token0Input, position])

  if (!token0Input || !token1Input) return <></>

  return (
    <Collapsible open={Boolean(token1Per0 && token1Per0)}>
      <Card>
        <CardContent className="grid grid-cols-3 pt-6">
          <Stat>
            <StatValue size="sm">{token1Per0 ?? "-"}</StatValue>
            <StatLabel size="sm">
              {token1Input.currency.symbol} per {token0Input.currency.symbol}
            </StatLabel>
          </Stat>
          <Stat>
            <StatValue size="sm">{token0Per1 ?? "-"}</StatValue>
            <StatLabel size="sm">
              {token0Input.currency.symbol} per {token1Input.currency.symbol}
            </StatLabel>
          </Stat>
          <Stat>
            <StatValue size="sm">{formatPercent(poolShare)}</StatValue>
            <StatLabel size="sm">Share of pool</StatLabel>
          </Stat>
        </CardContent>
      </Card>
    </Collapsible>
  )
}
