/* oxlint-disable @typescript-eslint/no-empty-function */
import { encodeFunctionData } from "viem"

import { multicallABI } from "@x7/contracts"

import { Multicall } from "../v3"

function validateAndParseBytes32(bytes32: string): string {
  // oxlint-disable-next-line @typescript-eslint/prefer-regexp-exec
  if (!bytes32.match(/^0x[0-9a-fA-F]{64}$/)) {
    throw new Error(`${bytes32} is not valid bytes32.`)
  }

  return bytes32.toLowerCase()
}

export abstract class MulticallExtended {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeMulticall(
    calldatas: string | string[],
    validation?: string | number | bigint
  ): string {
    // if there's no validation, we can just fall back to regular multicall
    if (typeof validation === "undefined") {
      return Multicall.encodeMulticall(calldatas)
    }

    // if there is validation, we have to normalize calldatas
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas]
    }

    // this means the validation value should be a previousBlockhash
    if (typeof validation === "string" && validation.startsWith("0x")) {
      const previousBlockhash = validateAndParseBytes32(validation)
      return encodeFunctionData({
        abi: multicallABI,
        functionName: "multicall",
        args: [
          previousBlockhash as `0x${string}`,
          calldatas as `0x${string}`[],
        ],
      })
    } else {
      // TODO: Monitor whatever this calls, idk if this deadline type will resolve to the proper overload function
      return encodeFunctionData({
        abi: multicallABI,
        functionName: "multicall",
        args: [BigInt(validation), calldatas as `0x${string}`[]],
      })
    }
  }
}
