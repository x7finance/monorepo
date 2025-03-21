import { formatUnits, parseUnits } from "viem";

export function fromReadableAmount(amount: number, decimals: number): bigint {
  return parseUnits(amount.toString(), decimals);
}

export function toReadableAmount(rawAmount: string, decimals: number): string {
  return formatUnits(BigInt(rawAmount), decimals);
}
