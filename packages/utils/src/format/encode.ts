import { toHex } from "viem"

import type Percent from "../math/Percent"

export function encodeFeeBips(fee: Percent): string {
  return toHex(fee.multiply(10_000).quotient)
}
