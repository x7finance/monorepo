import { parseUnits } from "viem"

/**
 * parseUnits() that never throws. viem's parseUnits throws on partial/invalid
 * decimal strings (e.g. "", ".", "1.", "0.") — which are normal intermediate
 * states while a user types into an amount field — so calling it directly in
 * render or a hook crashes the app. Use this for any raw user-entered value.
 *
 * Returns 0n for undefined/empty/invalid input.
 */
export function safeParseUnits(
  value: string | undefined | null,
  decimals: number
): bigint {
  if (!value) return 0n
  try {
    return parseUnits(value, decimals)
  } catch {
    return 0n
  }
}

/** safeParseUnits with 18 decimals (native/ETH amounts). */
export function safeParseEther(value: string | undefined | null): bigint {
  return safeParseUnits(value, 18)
}
