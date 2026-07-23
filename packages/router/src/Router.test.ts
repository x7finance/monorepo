import { describe, expect, it } from "vitest"

import { LiquidityProviders } from "./liquidity-providers/types"
import { Router } from "./Router"

// findRouteType only reads `poolName` off each PoolCode, so a minimal
// stand-in map is enough to exercise the classification logic.
type PoolCodesArg = Parameters<typeof Router.findRouteType>[0]

const poolMap = (names: string[]): PoolCodesArg =>
  new Map(
    names.map((poolName, i) => [`0x${i}`, { poolName }])
  ) as unknown as PoolCodesArg

const keys = (n: number) => Array.from({ length: n }, (_, i) => `0x${i}`)

describe("Router.findRouteType", () => {
  // Regression guard: these used `??` between boolean startsWith() results,
  // which short-circuits on `false`, so an all-internal route was never
  // classified "Internal". Must be `||`.
  it("classifies an all-Sushi route as Internal", () => {
    const map = poolMap([
      LiquidityProviders.SushiSwapV2,
      LiquidityProviders.SushiSwapV3,
    ])
    expect(Router.findRouteType(map, keys(2))).toBe("Internal")
  })

  it("treats wrapped-native pools as Internal", () => {
    const map = poolMap(["Wrap ETH", LiquidityProviders.Trident])
    expect(Router.findRouteType(map, keys(2))).toBe("Internal")
  })

  it("classifies a mix of internal and external pools as Mix", () => {
    const map = poolMap([LiquidityProviders.SushiSwapV2, "UniswapV3"])
    expect(Router.findRouteType(map, keys(2))).toBe("Mix")
  })

  it("classifies all-external pools as External", () => {
    const map = poolMap(["UniswapV2", "PancakeSwap"])
    expect(Router.findRouteType(map, keys(2))).toBe("External")
  })
})
