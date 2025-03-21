import invariant from "tiny-invariant";

import type { RoutePlanner } from "../utils/routerCommands";
import type { Command, TradeConfig } from "./Command";
import { RouterTradeType } from "./Command";
import type { NFT20Data } from "./protocols/nft20";
import type { SeaportData } from "./protocols/seaport";

export type SupportedProtocolsData = SeaportData | NFT20Data;

export abstract class NFTTrade<T> implements Command {
  readonly tradeType: RouterTradeType = RouterTradeType.NFTTrade;
  readonly orders: T[];
  readonly market: Market;

  constructor(market: Market, orders: T[]) {
    invariant(orders.length > 0, "no buy Items");
    this.market = market;
    this.orders = orders;
  }

  abstract encode(planner: RoutePlanner, config: TradeConfig): void;

  abstract getBuyItems(): BuyItem[];

  // optional parameter for the markets that accept ERC20s not just ETH
  abstract getTotalPrice(token?: string): bigint;
}

export interface BuyItem {
  tokenAddress: string;
  tokenId: bigint;
  tokenType: TokenType;
  amount?: bigint; // for 1155
}

export enum Market {
  Foundation = "foundation",
  LooksRareV2 = "looksrareV2",
  NFT20 = "nft20",
  NFTX = "nftx",
  Seaport = "seaport",
  Sudoswap = "Sudoswap",
  Cryptopunks = "cryptopunks",
  X2Y2 = "x2y2",
  Element = "element",
}

export enum TokenType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  Cryptopunk = "Cryptopunk",
}
