/* oxlint-disable @typescript-eslint/no-empty-function */
import { encodeFunctionData } from "viem"

import { selfPermitABI } from "@x7/contracts"
import type { Token } from "@x7/utils"

export interface StandardPermitArguments {
  v: 0 | 1 | 27 | 28
  r: string
  s: string
  amount: bigint
  deadline: bigint
}

export interface AllowedPermitArguments {
  v: 0 | 1 | 27 | 28
  r: string
  s: string
  nonce: bigint
  expiry: bigint
}

export type PermitOptions = StandardPermitArguments | AllowedPermitArguments

function isAllowedPermit(
  permitOptions: PermitOptions
): permitOptions is AllowedPermitArguments {
  return "nonce" in permitOptions
}

export abstract class SelfPermit {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodePermit(token: Token, options: PermitOptions) {
    return isAllowedPermit(options)
      ? encodeFunctionData({
          abi: selfPermitABI,
          functionName: "selfPermitAllowed",
          args: [
            token.address,
            options.nonce,
            options.expiry,
            options.v,
            options.r as `0x${string}`,
            options.s as `0x${string}`,
          ],
        })
      : encodeFunctionData({
          abi: selfPermitABI,
          functionName: "selfPermit",
          args: [
            token.address,
            options.amount,
            options.deadline,
            options.v,
            options.r as `0x${string}`,
            options.s as `0x${string}`,
          ],
        })
  }
}
