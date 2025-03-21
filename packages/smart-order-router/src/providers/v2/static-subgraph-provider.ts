/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */
import _ from "lodash";

import { Pair } from "@x7/sdk";
import { ChainId, Implementation } from "@x7/utils";
import type { Token } from "@x7/utils";

import { WRAPPED_NATIVE_CURRENCY } from "../../utils/chains";
import {
  DAI_MAINNET,
  USDC_MAINNET,
  USDT_MAINNET,
  WBTC_MAINNET,
} from "../token-provider";
import type { IV2SubgraphProvider, V2SubgraphPool } from "./subgraph-provider";

type ChainTokenList = Readonly<Record<ChainId, Token[]>>;

// @ts-expect-error: fix migration
const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM],
    DAI_MAINNET,
    USDC_MAINNET,
    USDT_MAINNET,
    WBTC_MAINNET,
  ],
  [ChainId.ETHEREUM_TESTNET]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM_TESTNET],
  ],
  //v2 not deployed on [optimism, arbitrum, polygon, celo, gnosis, moonbeam, bnb, avalanche] and their testnets
  [ChainId.OPTIMISM]: [],
  [ChainId.ARBITRUM]: [],
  [ChainId.ARBITRUM_TESTNET]: [],
  [ChainId.POLYGON]: [],
  [ChainId.POLYGON_TESTNET]: [],
  [ChainId.BSC]: [],
  [ChainId.BASE_TESTNET]: [],
  [ChainId.BASE]: [],
};

/**
 * Provider that does not get data from an external source and instead returns
 * a hardcoded list of Subgraph pools.
 *
 * Since the pools are hardcoded, the liquidity/price values are dummys and should not
 * be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. subgraph not available.
 *
 * @export
 * @class StaticV2SubgraphProvider
 */
export class StaticV2SubgraphProvider implements IV2SubgraphProvider {
  constructor(private chainId: ChainId) {}

  public async getPools(
    tokenIn?: Token,
    tokenOut?: Token,
  ): Promise<V2SubgraphPool[]> {
    const bases = BASES_TO_CHECK_TRADES_AGAINST[this.chainId];

    const basePairs: [Token, Token][] = _.flatMap(
      bases,
      (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]),
    );

    if (tokenIn && tokenOut) {
      basePairs.push(
        [tokenIn, tokenOut],
        ...bases.map((base): [Token, Token] => [tokenIn, base]),
        ...bases.map((base): [Token, Token] => [tokenOut, base]),
      );
    }

    const pairs: [Token, Token][] = _(basePairs)
      .filter((tokens): tokens is [Token, Token] =>
        Boolean(tokens[0] && tokens[1]),
      )
      .filter(
        ([tokenA, tokenB]) =>
          tokenA.address !== tokenB.address && !tokenA.equals(tokenB),
      )
      .value();

    const poolAddressSet = new Set<string>();

    const subgraphPools: V2SubgraphPool[] = _(pairs)
      .map(([tokenA, tokenB]) => {
        const poolAddress = Pair.getAddress(
          tokenA,
          tokenB,
          Implementation.UNISWAP,
        );

        if (poolAddressSet.has(poolAddress)) {
          return undefined;
        }
        poolAddressSet.add(poolAddress);

        const [token0, token1] = tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA];

        return {
          id: poolAddress,
          liquidity: "100",
          token0: {
            id: token0.address,
          },
          token1: {
            id: token1.address,
          },
          supply: 100,
          reserve: 100,
          reserveUSD: 100,
        };
      })
      .compact()
      .value();

    return subgraphPools;
  }
}
