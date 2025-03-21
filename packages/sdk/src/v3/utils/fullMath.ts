/* eslint-disable @typescript-eslint/no-empty-function */
import { ONE, ZERO } from "@x7/utils";

export abstract class FullMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static mulDivRoundingUp(
    a: bigint,
    b: bigint,
    denominator: bigint,
  ): bigint {
    const product = a * b;
    let result = product / denominator;

    if (product % denominator !== ZERO) {
      result += ONE;
    }
    return result;
  }
}
