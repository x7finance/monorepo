/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-empty-function */
import { encodeFunctionData } from "viem"

import { mutlicall3ABI } from "@x7/contracts"

export abstract class Multicall {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeMulticall(calldatas: string | string[]): string {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas]
    }

    return calldatas.length === 1
      ? calldatas[0]!
      : encodeFunctionData({
          abi: mutlicall3ABI,
          functionName: "multicall",
          args: [calldatas as `0x${string}`[]],
        })
  }
}
