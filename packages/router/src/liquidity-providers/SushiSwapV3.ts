import type { PublicClient } from "viem";

import { ChainId } from "@x7/utils";

import { LiquidityProviders } from "./LiquidityProvider";
import { UniswapV3BaseProvider } from "./UniswapV3Base";

export class SushiSwapV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ARBITRUM]: "0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e",
      [ChainId.BSC]: "0x126555dd55a39328F69400d6aE4F782Bd4C34ABb",
      [ChainId.ETHEREUM]: "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F",
      [ChainId.OPTIMISM]: "0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0",
      [ChainId.POLYGON]: "0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2",
      [ChainId.BASE]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
    } as const;
    const initCodeHash = {
      [ChainId.ARBITRUM]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.BSC]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.ETHEREUM]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.OPTIMISM]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.POLYGON]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
      [ChainId.BASE]:
        "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
    } as const;

    const tickLens = {
      [ChainId.ARBITRUM]: "0x8516944E89f296eb6473d79aED1Ba12088016c9e",
      [ChainId.BSC]: "0x10c19390E1Ac2Fd6D0c3643a2320b0abA38E5bAA",
      [ChainId.ETHEREUM]: "0xFB70AD5a200d784E7901230E6875d91d5Fa6B68c",
      [ChainId.OPTIMISM]: "0x0367a647A68f304f2A6e453c25033a4249d7F2C6",
      [ChainId.POLYGON]: "0x9fdeA1412e50D78B25aCE4f96d35801647Fdf7dA",
      [ChainId.BASE]: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
    } as const;
    super(chainId, web3Client, factory, initCodeHash, tickLens);
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV3;
  }
  getPoolProviderName(): string {
    return "SushiSwapV3";
  }
}
