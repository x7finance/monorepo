import { NEGATIVE_ONE, ZERO } from "../../core/constants";

export abstract class LiquidityMath {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static addDelta(x: bigint, y: bigint): bigint {
    if (y < ZERO) {
      return x - y * NEGATIVE_ONE;
    } else {
      return x + y;
    }
  }
}
