import type { BigintIsh } from "../core/constants"
import type { FeeOptions } from "../v3"
import type { Token } from "@x7/utils"

/* oxlint-disable @typescript-eslint/no-empty-function */
import { encodeFunctionData } from "viem"

import { peripheryPaymentsWithFeeExtendedABI } from "@x7/contracts"
import { encodeFeeBips } from "@x7/utils"

import { validateAndParseAddress } from "../core/validateAndParseAddress"
import { Payments } from "../v3"

export abstract class PaymentsExtended {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeUnwrapWETH9(
    amountMinimum: bigint,
    recipient?: string,
    feeOptions?: FeeOptions
  ): string {
    // if there's a recipient, just pass it along
    if (typeof recipient === "string") {
      return Payments.encodeUnwrapWETH9(amountMinimum, recipient, feeOptions)
    }

    if (feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "unwrapWETH9WithFee",
        args: [BigInt(amountMinimum), BigInt(feeBips), feeRecipient],
      })
    } else {
      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "unwrapWETH9",
        args: [BigInt(amountMinimum)],
      })
    }
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: bigint,
    recipient?: string,
    feeOptions?: FeeOptions
  ): string {
    // if there's a recipient, just pass it along
    if (typeof recipient === "string") {
      return Payments.encodeSweepToken(
        token,
        amountMinimum,
        recipient,
        feeOptions
      )
    }

    if (feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "sweepTokenWithFee",
        args: [
          token.address,
          BigInt(amountMinimum),
          BigInt(feeBips),
          feeRecipient,
        ],
      })
    } else {
      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "sweepToken",
        args: [token.address, BigInt(amountMinimum)],
      })
    }
  }

  public static encodePull(token: Token, amount: BigintIsh): string {
    return encodeFunctionData({
      abi: peripheryPaymentsWithFeeExtendedABI,
      functionName: "pull",
      args: [token.address, BigInt(amount)],
    })
  }

  public static encodeWrapETH(amount: BigintIsh): string {
    return encodeFunctionData({
      abi: peripheryPaymentsWithFeeExtendedABI,
      functionName: "wrapETH",
      args: [BigInt(amount)],
    })
  }
}
