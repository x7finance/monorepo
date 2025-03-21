import invariant from "tiny-invariant";

import { ETH_ADDRESS_02 } from "@x7/utils";

import { WETH_ADDRESS } from "../../utils/constants";
import type { Permit2Permit } from "../../utils/inputTokens";
import { encodeInputTokenOptions } from "../../utils/inputTokens";
import type { RoutePlanner } from "../../utils/routerCommands";
import { CommandType } from "../../utils/routerCommands";
import type { Command, TradeConfig } from "../Command";
import { RouterTradeType } from "../Command";

export class UnwrapWETH implements Command {
  readonly tradeType: RouterTradeType = RouterTradeType.UnwrapWETH;
  readonly permit2Data: Permit2Permit | undefined;
  readonly wethAddress: string;
  readonly amount: bigint;

  constructor(amount: bigint, chainId: number, permit2?: Permit2Permit) {
    this.wethAddress = WETH_ADDRESS(chainId);
    this.amount = amount;

    if (permit2) {
      invariant(
        permit2.details.token.toLowerCase() === this.wethAddress.toLowerCase(),
        `must be permitting WETH address: ${this.wethAddress}`,
      );
      invariant(
        permit2.details.amount >= BigInt(amount),
        `Did not permit enough WETH for unwrapWETH transaction`,
      );
      this.permit2Data = permit2;
    }
  }

  encode(planner: RoutePlanner, _: TradeConfig): void {
    encodeInputTokenOptions(planner, {
      permit2Permit: this.permit2Data,
      permit2TransferFrom: {
        token: this.wethAddress,
        amount: this.amount.toString(),
      },
    });
    planner.addCommand(CommandType.UNWRAP_WETH, [ETH_ADDRESS_02, this.amount]);
  }
}
