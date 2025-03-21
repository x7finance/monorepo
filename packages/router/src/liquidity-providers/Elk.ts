import type { PublicClient } from "viem";

import { ChainId } from "@x7/utils";

import { LiquidityProviders } from "./LiquidityProvider";
import { UniswapV2BaseProvider } from "./UniswapV2Base";

export class ElkProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: "0xE3BD06c7ac7E1CeB17BdD2E5BA83E40D1515AF2a",
      [ChainId.BSC]: "0x31aFfd875e9f68cd6Cd12Cee8943566c9A4bBA13",
      [ChainId.ETHEREUM]: "0x6511eBA915fC1b94b2364289CCa2b27AE5898d80",
      [ChainId.ARBITRUM]: "0xA59B2044EAFD15ee4deF138D410d764c9023E1F0",
      [ChainId.OPTIMISM]: "0xedfad3a0F42A8920B011bb0332aDe632e552d846",
    } as const;
    const initCodeHash = {
      [ChainId.POLYGON]:
        "0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31",
      [ChainId.BSC]:
        "0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31",
      [ChainId.ETHEREUM]:
        "0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31",
      [ChainId.ARBITRUM]:
        "0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31",
      [ChainId.OPTIMISM]:
        "0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31",
    } as const;
    super(chainId, web3Client, factory, initCodeHash);
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Elk;
  }
  getPoolProviderName(): string {
    return "Elk";
  }
}
