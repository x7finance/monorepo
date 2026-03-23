import { encodePacked } from "viem"

import type { Currency, Token } from "@x7/utils"

import type { Pool } from "../entities/pool"
import type { RouteV3 } from "../entities/route"

/**
 * Converts a route to a hex encoded path
 * @param route the v3 path to convert to an encoded path
 * @param exactOutput whether the route should be encoded in reverse, for making exact output swaps
 */
export function encodeRouteToPath(
  route: RouteV3<Currency, Currency>,
  exactOutput: boolean
): `0x${string}` {
  const firstInputToken: Token = route.input.wrapped

  const { path, types } = route.pools.reduce(
    (
      {
        inputToken: accInputToken,
        path: accPath,
        types: accTypes,
      }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool,
      index
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken: Token = pool.token0.equals(accInputToken)
        ? pool.token1
        : pool.token0
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ["address", "uint24", "address"],
          path: [accInputToken.address, pool.fee, outputToken.address],
        }
      } else {
        return {
          inputToken: outputToken,
          types: [...accTypes, "uint24", "address"],
          path: [...accPath, pool.fee, outputToken.address],
        }
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  return exactOutput
    ? encodePacked(types.reverse(), path.reverse())
    : encodePacked(types, path)
}
