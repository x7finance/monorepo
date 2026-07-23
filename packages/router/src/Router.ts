/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-extraneous-class */
import type { Address, Hex } from "viem"

import type { MultiRoute, NetworkInfo, RPool, RToken } from "@x7/tines"
import { findMultiRouteExactIn, getBigInt, RouteStatus } from "@x7/tines"
import type { ChainId, Currency } from "@x7/utils"
import { Token, WNATIVE } from "@x7/utils"

import { LiquidityProviders } from "./liquidity-providers/LiquidityProvider"
import type { PoolCode } from "./pools/PoolCode"
import { getRouteProcessorCode } from "./TinesToRouteProcessor"
import type { PermitData } from "./TinesToRouteProcessor2"
import {
  getRouteProcessor2Code,
  RouterLiquiditySource,
} from "./TinesToRouteProcessor2"
import { getRouteProcessor4Code } from "./TinesToRouteProcessor4"

function TokenToRToken(t: Currency): RToken {
  if (t instanceof Token) return t as RToken
  const nativeRToken: RToken = {
    address: "",
    name: t.name,
    symbol: t.symbol,
    chainId: t.chainId,
    decimals: 18,
  }
  return nativeRToken
}

export interface RPParams {
  tokenIn: Address
  amountIn: bigint
  tokenOut: Address
  amountOutMin: bigint
  to: Address
  routeCode: Hex
  value?: bigint
}

export type PoolFilter = (list: RPool) => boolean

export class Router {
  static findRouteType(
    poolCodesMap: Map<string, PoolCode>,
    addresses: string[]
  ) {
    // const poolCodes = addresses.map(address => poolCodesMap.get(address))
    if (
      addresses.every((address) => {
        const poolName = poolCodesMap.get(address)?.poolName
        return (
          poolName?.startsWith("Wrap") ||
          poolName?.startsWith(LiquidityProviders.SushiSwapV2) ||
          poolName?.startsWith(LiquidityProviders.SushiSwapV3) ||
          poolName?.startsWith(LiquidityProviders.Trident)
        )
      })
    ) {
      return "Internal"
    } else if (
      addresses.some((address) => {
        const poolName = poolCodesMap.get(address)?.poolName
        return (
          !poolName?.startsWith("Wrap") &&
          (poolName?.startsWith(LiquidityProviders.SushiSwapV2) ||
            poolName?.startsWith(LiquidityProviders.SushiSwapV3) ||
            poolName?.startsWith(LiquidityProviders.Trident))
        )
      }) &&
      addresses.some((address) => {
        const poolName = poolCodesMap.get(address)?.poolName
        return (
          !poolName?.startsWith("Wrap") &&
          (!poolName?.startsWith(LiquidityProviders.SushiSwapV2) ||
            !poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
            !poolName.startsWith(LiquidityProviders.Trident))
        )
      })
    ) {
      return "Mix"
    } else if (
      addresses.some((address) => {
        const poolName = poolCodesMap.get(address)?.poolName
        return (
          poolName?.startsWith("Wrap") ||
          (!poolName?.startsWith(LiquidityProviders.SushiSwapV2) &&
            !poolName?.startsWith(LiquidityProviders.SushiSwapV3) &&
            !poolName?.startsWith(LiquidityProviders.Trident))
        )
      })
    ) {
      return "External"
    }

    return "Unknown"
  }

  static findSushiRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Currency,
    amountIn: bigint,
    toToken: Currency,
    gasPrice: number
  ) {
    return Router.findBestRoute(
      poolCodesMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      [
        LiquidityProviders.NativeWrap,
        LiquidityProviders.SushiSwapV2,
        LiquidityProviders.SushiSwapV3,
        LiquidityProviders.Trident,
      ]
    )
  }

  static findSpecialRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Currency,
    amountIn: bigint,
    toToken: Currency,
    gasPrice: number,
    maxPriceImpact = 1 // 1%
  ) {
    // Find preferrable route
    const preferrableRoute = Router.findBestRoute(
      poolCodesMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      [
        LiquidityProviders.NativeWrap,
        LiquidityProviders.SushiSwapV2,
        LiquidityProviders.SushiSwapV3,
        LiquidityProviders.Trident,
      ]
    )
    // If the route is successful and the price impact is less than maxPriceImpact, then return the route
    if (
      preferrableRoute.status === RouteStatus.Success &&
      preferrableRoute.priceImpact !== undefined &&
      preferrableRoute.priceImpact < maxPriceImpact / 100
    ) {
      return preferrableRoute
    }
    // Otherwise, find the route using all possible liquidity providers
    return Router.findBestRoute(
      poolCodesMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      gasPrice
    )
  }

  static findBestRoute(
    poolCodesMap: Map<string, PoolCode>,
    chainId: ChainId,
    fromToken: Currency,
    amountIn: bigint,
    toToken: Currency,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter
  ): MultiRoute {
    const networks: NetworkInfo[] = [
      {
        chainId: Number(chainId),
        baseToken: WNATIVE[chainId as keyof typeof WNATIVE] as RToken,
        gasPrice: gasPrice,
      },
    ]

    let poolCodes = Array.from(poolCodesMap.values())
    if (providers) {
      poolCodes = poolCodes.filter((pc) =>
        [...providers, LiquidityProviders.NativeWrap].includes(
          pc.liquidityProvider
        )
      )
    }
    let pools = Array.from(poolCodes).map((pc) => pc.pool)

    if (poolFilter) pools = pools.filter(poolFilter)

    const route = findMultiRouteExactIn(
      TokenToRToken(fromToken),
      TokenToRToken(toToken),
      amountIn,
      pools,
      networks,
      gasPrice
    )

    return {
      ...route,
      legs: route.legs.map((l) => ({
        ...l,
        poolName: poolCodesMap.get(l.poolAddress)?.poolName ?? "Unknown Pool",
      })),
    }
  }

  static routeProcessorParams(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Currency,
    toToken: Currency,
    to: Address,
    RPAddr: Address,
    maxPriceImpact = 0.005
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? fromToken.address
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

    const tokenOut =
      toToken instanceof Token
        ? toToken.address
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const amountOutMin =
      (route.amountOutBI * getBigInt((1 - maxPriceImpact) * 1_000_000)) /
      1_000_000n

    return {
      tokenIn,
      amountIn: route.amountInBI,
      tokenOut,
      amountOutMin,
      to,
      routeCode: getRouteProcessorCode(route, RPAddr, to, poolCodesMap) as Hex,
      value: fromToken instanceof Token ? undefined : route.amountInBI,
    }
  }

  static routeProcessor2Params(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Currency,
    toToken: Currency,
    to: Address,
    RPAddr: Address,
    permits: PermitData[] = [],
    maxPriceImpact = 0.005,
    source = RouterLiquiditySource.Sender
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? fromToken.address
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const tokenOut =
      toToken instanceof Token
        ? toToken.address
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const amountOutMin =
      (route.amountOutBI * getBigInt((1 - maxPriceImpact) * 1_000_000)) /
      1_000_000n

    return {
      tokenIn,
      amountIn: route.amountInBI,
      tokenOut,
      amountOutMin,
      to,
      routeCode: getRouteProcessor2Code(
        route,
        RPAddr,
        to,
        poolCodesMap,
        permits,
        source
      ) as Hex,
      value: fromToken instanceof Token ? undefined : route.amountInBI,
    }
  }

  static routeProcessor3Params = this.routeProcessor2Params
  static routeProcessor3_1Params = this.routeProcessor2Params
  static routeProcessor3_2Params = this.routeProcessor2Params

  static routeProcessor4Params(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Currency,
    toToken: Currency,
    to: Address,
    RPAddr: Address,
    permits: PermitData[] = [],
    maxPriceImpact = 0.005
  ): RPParams {
    const tokenIn =
      fromToken instanceof Token
        ? fromToken.address
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const tokenOut =
      toToken instanceof Token
        ? toToken.address
        : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const amountOutMin =
      (route.amountOutBI * getBigInt((1 - maxPriceImpact) * 1_000_000)) /
      1_000_000n

    return {
      tokenIn,
      amountIn: route.amountInBI,
      tokenOut,
      amountOutMin,
      to,
      routeCode: getRouteProcessor4Code(
        route,
        RPAddr,
        to,
        poolCodesMap,
        permits
      ) as Hex,
      value: fromToken instanceof Token ? undefined : route.amountInBI,
    }
  }

  // Human-readable route printing
  static routeToHumanString(
    poolCodesMap: Map<string, PoolCode>,
    route: MultiRoute,
    fromToken: Currency,
    toToken: Currency,
    shiftPrimary = "",
    shiftSub = "    "
  ): string {
    let res = ""
    res += `${shiftPrimary}Route Status: ${route.status}\n`
    res += `${shiftPrimary}Input: ${
      route.amountIn / 10 ** fromToken.decimals
    } ${fromToken.symbol}\n`
    route.legs.forEach((l, i) => {
      res += `${shiftSub}${i + 1}. ${l.tokenFrom.symbol} ${Math.round(
        l.absolutePortion * 100
      )}% -> [${poolCodesMap.get(l.poolAddress)?.poolName}] -> ${
        l.tokenTo.symbol
      }\n`
    })
    const output =
      parseInt(route.amountOutBI.toString()) / 10 ** toToken.decimals
    res += `${shiftPrimary}Output: ${output} ${route.toToken.symbol}`

    return res
  }
}

export function tokenQuantityString(token: Currency, amount: bigint) {
  const denominator = 10n ** BigInt(token.decimals)
  const integer = amount / denominator
  const fractional = amount - integer * denominator
  if (fractional === 0n) return `${integer} ${token.symbol}`
  const paddedFractional = fractional.toString().padStart(token.decimals, "0")
  return `${integer}.${paddedFractional} ${token.symbol}`
}
