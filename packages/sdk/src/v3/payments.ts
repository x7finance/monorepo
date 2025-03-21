/* eslint-disable @typescript-eslint/no-empty-function */
import { encodeFunctionData } from "viem";

import { peripheryPaymentsWithFeeExtendedABI } from "@x7/contracts";
import type { Percent, Token } from "@x7/utils";

import { validateAndParseAddress } from "../core";

export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent;

  /**
   * The recipient of the fee.
   */
  recipient: string;
}

export abstract class Payments {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  private static encodeFeeBips(fee: Percent): bigint {
    return fee.multiply(10_000).quotient;
  }

  public static encodeUnwrapWETH9(
    amountMinimum: bigint,
    recipient: string,
    feeOptions?: FeeOptions,
  ): string {
    recipient = validateAndParseAddress(recipient);

    if (feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee);
      const feeRecipient: string = validateAndParseAddress(
        feeOptions.recipient,
      );

      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "unwrapWETH9WithFee",
        args: [
          BigInt(amountMinimum),
          recipient as `0x${string}`,
          feeBips,
          feeRecipient as `0x${string}`,
        ],
      });
    } else {
      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "unwrapWETH9",
        args: [BigInt(amountMinimum), recipient as `0x${string}`],
      });
    }
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: bigint,
    recipient: string,
    feeOptions?: FeeOptions,
  ): string {
    recipient = validateAndParseAddress(recipient);

    if (feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee);
      const feeRecipient: string = validateAndParseAddress(
        feeOptions.recipient,
      );

      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "sweepTokenWithFee",
        args: [
          token.address,
          BigInt(amountMinimum),
          recipient as `0x${string}`,
          feeBips,
          feeRecipient as `0x${string}`,
        ],
      });
    } else {
      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeExtendedABI,
        functionName: "sweepToken",
        args: [
          token.address,
          BigInt(amountMinimum),
          recipient as `0x${string}`,
        ],
      });
    }
  }

  public static encodeRefundETH(): string {
    return encodeFunctionData({
      abi: peripheryPaymentsWithFeeExtendedABI,
      functionName: "refundETH",
    });
  }
}
