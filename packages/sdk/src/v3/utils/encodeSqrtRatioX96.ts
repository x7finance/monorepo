import { sqrt } from "@x7/utils"

/**
 * Returns the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 The numerator amount i.e., the amount of token1
 * @param amount0 The denominator amount i.e., the amount of token0
 * @returns The sqrt ratio
 */

export function encodeSqrtRatioX96(amount1: bigint, amount0: bigint): bigint {
  const numerator = BigInt(amount1) << BigInt(192)
  const denominator = BigInt(amount0)
  const ratioX192 = numerator / denominator

  return sqrt(ratioX192)
}
