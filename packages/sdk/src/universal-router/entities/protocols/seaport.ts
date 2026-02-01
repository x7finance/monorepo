/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-for-in-array */

import { encodeFunctionData } from "viem";

import { seaportABI } from "@x7/contracts";
import { ETH_ADDRESS } from "@x7/utils";

import type { Permit2Permit } from "../../utils/inputTokens";
import { encodeInputTokenOptions } from "../../utils/inputTokens";
import type { RoutePlanner } from "../../utils/routerCommands";
import { CommandType } from "../../utils/routerCommands";
import type { TradeConfig } from "../Command";
import type { BuyItem } from "../NFTTrade";
import { Market, NFTTrade, TokenType } from "../NFTTrade";

export interface SeaportData {
  items: Order[];
  recipient: `0x${string}`; // address
  protocolAddress: string;
  inputTokenProcessing?: InputTokenProcessing[];
}

export interface InputTokenProcessing {
  token: string;
  permit2Permit?: Permit2Permit;
  protocolApproval: boolean;
  permit2TransferFrom: boolean;
}

export interface FulfillmentComponent {
  orderIndex: bigint;
  itemIndex: bigint;
}

export interface OfferItem {
  itemType: number; // enum
  token: `0x${string}`; // address
  identifierOrCriteria: bigint;
  startAmount: bigint;
  endAmount: bigint;
}

export type ConsiderationItem = OfferItem & {
  recipient: `0x${string}`;
};

export interface Order {
  parameters: OrderParameters;
  signature: `0x${string}`;
}

interface OrderParameters {
  offerer: `0x${string}`; // address,
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  orderType: number; // enum
  startTime: bigint;
  endTime: bigint;
  zoneHash: `0x${string}`; // bytes32
  zone: `0x${string}`; // address
  salt: bigint;
  conduitKey: `0x${string}`; // bytes32,
  totalOriginalConsiderationItems: bigint;
}

export type AdvancedOrder = Order & {
  numerator: bigint; // uint120
  denominator: bigint; // uint120
  extraData: `0x${string}`; // bytes
};

export class SeaportTrade extends NFTTrade<SeaportData> {
  public static OPENSEA_CONDUIT_KEY: `0x${string}` =
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";

  constructor(orders: SeaportData[]) {
    super(Market.Seaport, orders);
  }

  encode(planner: RoutePlanner, config: TradeConfig): void {
    for (const order of this.orders) {
      const advancedOrders: AdvancedOrder[] = [];
      const orderFulfillments: FulfillmentComponent[][] = order.items.map(
        (_, index) => [{ orderIndex: BigInt(index), itemIndex: BigInt(0) }],
      );
      const considerationFulFillments: FulfillmentComponent[][] =
        this.getConsiderationFulfillments(order.items);

      for (const item of order.items) {
        const { advancedOrder } = this.getAdvancedOrderParams(item);
        advancedOrders.push(advancedOrder);
      }

      let calldata: string;
      if (advancedOrders.length === 1) {
        calldata = encodeFunctionData({
          abi: seaportABI,
          functionName: "fulfillAdvancedOrder",
          args: [
            // @ts-expect-error: todo fix
            advancedOrders[0],
            [],
            SeaportTrade.OPENSEA_CONDUIT_KEY,
            order.recipient,
          ],
        });
      } else {
        calldata = encodeFunctionData({
          abi: seaportABI,
          functionName: "fulfillAvailableAdvancedOrders",
          args: [
            advancedOrders,
            [],
            orderFulfillments,
            considerationFulFillments,
            SeaportTrade.OPENSEA_CONDUIT_KEY,
            order.recipient,
            BigInt(100), // TODO: look into making this a better number
          ],
        });
      }

      if (order.inputTokenProcessing) {
        for (const inputToken of order.inputTokenProcessing)
          encodeInputTokenOptions(planner, {
            approval: inputToken.protocolApproval
              ? { token: inputToken.token, protocol: order.protocolAddress }
              : undefined,
            permit2Permit: inputToken.permit2Permit,
            permit2TransferFrom: inputToken.permit2TransferFrom
              ? {
                  token: inputToken.token,
                  amount: this.getTotalOrderPrice(
                    order,
                    inputToken.token,
                  ).toString(),
                }
              : undefined,
          });
      }

      planner.addCommand(
        this.commandMap(order.protocolAddress),
        [this.getTotalOrderPrice(order, ETH_ADDRESS).toString(), calldata],
        config.allowRevert,
      );
    }
  }

  getBuyItems(): BuyItem[] {
    const buyItems: BuyItem[] = [];
    for (const order of this.orders) {
      for (const item of order.items) {
        for (const offer of item.parameters.offer) {
          buyItems.push({
            tokenAddress: offer.token,
            tokenId: offer.identifierOrCriteria,
            tokenType: TokenType.ERC721,
          });
        }
      }
    }
    return buyItems;
  }

  getInputTokens(): Set<string> {
    const inputTokens = new Set<string>();
    for (const order of this.orders) {
      for (const item of order.items) {
        for (const consideration of item.parameters.consideration) {
          const token = consideration.token.toLowerCase();
          inputTokens.add(token);
        }
      }
    }
    return inputTokens;
  }

  getTotalOrderPrice(order: SeaportData, token: string = ETH_ADDRESS): bigint {
    let totalOrderPrice = BigInt(0);
    for (const item of order.items) {
      totalOrderPrice =
        totalOrderPrice +
        BigInt(this.calculateValue(item.parameters.consideration, token));
    }
    return totalOrderPrice;
  }

  getTotalPrice(token: string = ETH_ADDRESS): bigint {
    let totalPrice = BigInt(0);
    for (const order of this.orders) {
      for (const item of order.items) {
        totalPrice =
          totalPrice +
          BigInt(this.calculateValue(item.parameters.consideration, token));
      }
    }
    return totalPrice;
  }

  private commandMap(protocolAddress: string): CommandType {
    switch (protocolAddress.toLowerCase()) {
      case "0x00000000000000adc04c56bf30ac9d3c0aaf14dc": // Seaport v1.5
        return CommandType.SEAPORT_V1_5;
      case "0x00000000000001ad428e4906ae43d8f9852d0dd6": // Seaport v1.4
        return CommandType.SEAPORT_V1_4;
      default:
        throw new Error("unsupported Seaport address");
    }
  }

  private getConsiderationFulfillments(
    protocolDatas: Order[],
  ): FulfillmentComponent[][] {
    const considerationFulfillments: FulfillmentComponent[][] = [];
    const considerationRecipients: string[] = [];

    for (const i in protocolDatas) {
      const protocolData = protocolDatas[i];

      for (const j in protocolData?.parameters.consideration) {
        // @ts-expect-error: todo fix
        const item = protocolData.parameters.consideration[j];

        if (
          considerationRecipients.findIndex((x) => x === item.recipient) === -1
        ) {
          considerationRecipients.push(item.recipient);
        }

        const recipientIndex = considerationRecipients.findIndex(
          (x) => x === item.recipient,
        );

        if (!considerationFulfillments[recipientIndex]) {
          considerationFulfillments.push([
            {
              orderIndex: BigInt(i),
              itemIndex: BigInt(j),
            },
          ]);
        } else {
          considerationFulfillments[recipientIndex].push({
            orderIndex: BigInt(i),
            itemIndex: BigInt(j),
          });
        }
      }
    }
    return considerationFulfillments;
  }

  private getAdvancedOrderParams(data: Order): {
    advancedOrder: AdvancedOrder;
  } {
    const advancedOrder = {
      parameters: data.parameters,
      numerator: BigInt(1),
      denominator: BigInt(1),
      signature: data.signature,
      extraData: "0x00" as `0x${string}`,
    };
    return { advancedOrder };
  }

  private calculateValue(
    considerations: ConsiderationItem[],
    token: string,
  ): bigint {
    return considerations.reduce(
      (amt: bigint, consideration: ConsiderationItem) =>
        consideration.token.toLowerCase() === token.toLowerCase()
          ? amt + BigInt(consideration.startAmount)
          : amt,
      BigInt(0),
    );
  }
}
