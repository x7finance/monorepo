import invariant from "tiny-invariant";
import { maxUint256 } from "viem";

import { ZERO } from "../../core/constants";

const TWO = BigInt(2);
const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map(
  (pow: number): [number, bigint] => [pow, TWO ** BigInt(pow)],
);

export function mostSignificantBit(x: bigint): number {
  invariant(x > ZERO, "ZERO");
  invariant(x <= maxUint256, "MAX");

  let msb = 0;
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      x >>= BigInt(power);
      msb += power;
    }
  }
  return msb;
}
