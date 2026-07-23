import { formatUnits } from "viem"

import { safeParseUnits } from "@x7/utils"

export function fromReadableAmount(amount: number, decimals: number): bigint {
  return safeParseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount: string, decimals: number): string {
  return formatUnits(BigInt(rawAmount), decimals)
}
