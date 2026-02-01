import type Percent from "../math/Percent"

import { toHex } from "viem"

export function encodeFeeBips(fee: Percent): string {
  return toHex(fee.multiply(10_000).quotient)
}
