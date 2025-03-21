import { generateRouterAddress } from "@x7/sdk";
import type { ApprovalTypes } from "@x7/sdk";
import { Implementation, LogCodes } from "@x7/utils";
import type { ChainId, Currency, CurrencyAmount } from "@x7/utils";

import SwapRouter02 from "../abis/swapRouter02.json";
import { log } from "../utils";
import type { IMulticallProvider } from "./multicall-provider";

interface TokenApprovalTypes {
  approvalTokenIn: ApprovalTypes;
  approvalTokenOut: ApprovalTypes;
}

/**
 * Provider for accessing the SwapRouter02 Contract .
 *
 * @export
 * @interface IRouterProvider
 */
export interface ISwapRouterProvider {
  /**
   * Get the approval method needed for each token. Throws an error if either query fails.
   *
   * @param tokenInAmount The Currency Amount of tokenIn needed by the user
   * @param tokenOutAmount The Currency Amount of tokenOut needed by the user
   * @returns the Approval Types for each token.
   */
  getApprovalType(
    tokenInAmount: CurrencyAmount<Currency>,
    tokenOutAmount: CurrencyAmount<Currency>,
    implementation: Implementation,
  ): Promise<TokenApprovalTypes>;
}

export class SwapRouterProvider implements ISwapRouterProvider {
  constructor(
    protected multicall2Provider: IMulticallProvider,
    protected chainId: ChainId,
  ) {}

  public async getApprovalType(
    tokenInAmount: CurrencyAmount<Currency>,
    tokenOutAmount: CurrencyAmount<Currency>,
    implementation?: Implementation,
  ): Promise<TokenApprovalTypes> {
    const functionParams: [string, string][] = [
      [
        tokenInAmount.currency.wrapped.address,
        tokenInAmount.quotient.toString(),
      ],
      [
        tokenOutAmount.currency.wrapped.address,
        tokenOutAmount.quotient.toString(),
      ],
    ];

    const tx =
      await this.multicall2Provider.callSameFunctionOnContractWithMultipleParams<
        [string, string],
        [ApprovalTypes]
      >({
        address: generateRouterAddress(
          this.chainId,
          implementation ?? Implementation.UNISWAP,
        ),
        contractInterface: SwapRouter02,
        functionName: "getApprovalType",
        functionParams,
      });

    if (!tx.results[0]?.success || !tx.results[1]?.success) {
      log.error(
        LogCodes.FAIL,
        "Failed to get approval type from swap router for token in or token out",
        { results: tx.results },
      );
      throw new Error(
        "Failed to get approval type from swap router for token in or token out",
      );
    }

    const { result: approvalTokenIn } = tx.results[0];
    const { result: approvalTokenOut } = tx.results[1];

    return {
      approvalTokenIn: approvalTokenIn[0],
      approvalTokenOut: approvalTokenOut[0],
    };
  }
}
