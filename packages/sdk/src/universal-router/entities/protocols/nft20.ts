import type { RoutePlanner } from "../../utils/routerCommands"
import type { TradeConfig } from "../Command"
import type { BuyItem } from "../NFTTrade"

import { encodeFunctionData } from "viem"

import { nft20ABI } from "@x7/contracts"

import { CommandType } from "../../utils/routerCommands"
import { Market, NFTTrade, TokenType } from "../NFTTrade"

export interface NFT20Data {
  tokenAddress: string
  tokenIds: bigint[]
  tokenAmounts: bigint[]
  recipient: string
  fee: bigint
  isV3: boolean
  value: bigint
}

export class NFT20Trade extends NFTTrade<NFT20Data> {
  constructor(orders: NFT20Data[]) {
    super(Market.NFT20, orders)
  }

  encode(planner: RoutePlanner, config: TradeConfig): void {
    for (const order of this.orders) {
      const calldata = encodeFunctionData({
        abi: nft20ABI,
        functionName: "ethForNft",
        args: [
          order.tokenAddress as `0x${string}`,
          order.tokenIds.map((ids) => BigInt(ids)),
          order.tokenAmounts.map((amts) => BigInt(amts)),
          order.recipient as `0x${string}`,
          Number(order.fee),
          order.isV3,
        ],
      })
      planner.addCommand(
        CommandType.NFT20,
        [order.value, calldata],
        config.allowRevert
      )
    }
  }

  getBuyItems(): BuyItem[] {
    const buyItems: BuyItem[] = []
    for (const pool of this.orders) {
      for (const tokenId of pool.tokenIds) {
        buyItems.push({
          tokenAddress: pool.tokenAddress,
          tokenId: tokenId,
          tokenType: TokenType.ERC721,
        })
      }
    }

    return buyItems
  }

  getTotalPrice(): bigint {
    let total = BigInt(0)
    for (const item of this.orders) {
      total = total + BigInt(item.value)
    }
    return total
  }
}
