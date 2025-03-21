/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import _ from "lodash";

import type { Token } from "@x7/utils";
import { ChainId, FeeAmount, LogCodes } from "@x7/utils";

import { unparseFeeAmount } from "../../utils/amounts";
import { WRAPPED_NATIVE_CURRENCY } from "../../utils/chains";
import { log } from "../../utils/log";
import type { ProviderConfig } from "../provider";
import {
  ARB_ARBITRUM,
  BTC_BNB,
  BUSD_BNB,
  DAI_ARBITRUM,
  DAI_BNB,
  DAI_MAINNET,
  DAI_OPTIMISM,
  DAI_POLYGON_MUMBAI,
  ETH_BNB,
  OP_OPTIMISM,
  USDC_ARBITRUM,
  USDC_BASE,
  USDC_BNB,
  USDC_MAINNET,
  USDC_OPTIMISM,
  USDC_POLYGON,
  USDC_SEPOLIA,
  USDT_ARBITRUM,
  USDT_BNB,
  USDT_MAINNET,
  USDT_OPTIMISM,
  WBTC_ARBITRUM,
  WBTC_OPTIMISM,
  WETH_POLYGON,
  WMATIC_POLYGON,
  WMATIC_POLYGON_MUMBAI,
} from "../token-provider";
import type { IV3PoolProvider } from "./pool-provider";
import type { IV3SubgraphProvider, V3SubgraphPool } from "./subgraph-provider";

type ChainTokenList = Readonly<Record<ChainId, Token[]>>;

// @ts-expect-error: fix migration
const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM],
    DAI_MAINNET,
    USDC_MAINNET,
    USDT_MAINNET,
  ],
  [ChainId.ETHEREUM_TESTNET]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM_TESTNET],
    USDC_SEPOLIA,
  ],
  [ChainId.OPTIMISM]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.OPTIMISM],
    USDC_OPTIMISM,
    DAI_OPTIMISM,
    USDT_OPTIMISM,
    WBTC_OPTIMISM,
    OP_OPTIMISM,
  ],
  [ChainId.ARBITRUM]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM],
    WBTC_ARBITRUM,
    DAI_ARBITRUM,
    USDC_ARBITRUM,
    USDT_ARBITRUM,
    ARB_ARBITRUM,
  ],
  [ChainId.ARBITRUM_TESTNET]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.ARBITRUM_TESTNET],
  ],
  [ChainId.POLYGON]: [USDC_POLYGON, WETH_POLYGON, WMATIC_POLYGON],
  [ChainId.POLYGON_TESTNET]: [
    DAI_POLYGON_MUMBAI,
    WRAPPED_NATIVE_CURRENCY[ChainId.POLYGON_TESTNET],
    WMATIC_POLYGON_MUMBAI,
  ],
  [ChainId.BSC]: [
    WRAPPED_NATIVE_CURRENCY[ChainId.BSC],
    BUSD_BNB,
    DAI_BNB,
    USDC_BNB,
    USDT_BNB,
    BTC_BNB,
    ETH_BNB,
  ],

  [ChainId.BASE_TESTNET]: [WRAPPED_NATIVE_CURRENCY[ChainId.BASE_TESTNET]],
  [ChainId.BASE]: [WRAPPED_NATIVE_CURRENCY[ChainId.BASE], USDC_BASE],
};

/**
 * Provider that uses a hardcoded list of V3 pools to generate a list of subgraph pools.
 *
 * Since the pools are hardcoded and the data does not come from the Subgraph, the TVL values
 * are dummys and should not be depended on.
 *
 * Useful for instances where other data sources are unavailable. E.g. Subgraph not available.
 *
 * @export
 * @class StaticV3SubgraphProvider
 */
export class StaticV3SubgraphProvider implements IV3SubgraphProvider {
  constructor(
    private chainId: ChainId,
    private poolProvider: IV3PoolProvider,
  ) {}

  public async getPools(
    tokenIn?: Token,
    tokenOut?: Token,
    providerConfig?: ProviderConfig,
  ): Promise<V3SubgraphPool[]> {
    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      "In static subgraph provider for V3",
    );
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

    const pairs: [Token, Token, FeeAmount][] = _(basePairs)
      .filter((tokens): tokens is [Token, Token] =>
        Boolean(tokens[0] && tokens[1]),
      )
      .filter(
        ([tokenA, tokenB]) =>
          tokenA.address !== tokenB.address && !tokenA.equals(tokenB),
      )
      .flatMap<[Token, Token, FeeAmount]>(([tokenA, tokenB]) => {
        return [
          [tokenA, tokenB, FeeAmount.LOWEST],
          [tokenA, tokenB, FeeAmount.LOW],
          [tokenA, tokenB, FeeAmount.MEDIUM],
          [tokenA, tokenB, FeeAmount.HIGH],
        ];
      })
      .value();

    log.info(
      LogCodes.FETCHING_SUBGRAPH_POOLS,
      `V3 Static subgraph provider about to get ${pairs.length} pools on-chain`,
    );
    const poolAccessor = await this.poolProvider.getPools(
      pairs,
      providerConfig,
    );
    const pools = poolAccessor.getAllPools();

    const poolAddressSet = new Set<string>();
    const subgraphPools: V3SubgraphPool[] = _(pools)
      .map((pool) => {
        const { token0, token1, fee, liquidity, poolType } = pool;

        const poolAddress = this.poolProvider
          .getPoolAddresses(pool.token0, pool.token1, pool.fee)
          .poolAddresses?.find((pa) => pa.implementation === poolType);

        if (poolAddress && poolAddressSet.has(poolAddress.address)) {
          return undefined;
        }
        if (poolAddress) poolAddressSet.add(poolAddress?.address);

        const liquidityNumber = Number(liquidity);

        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: poolAddress!.address,
          factory: poolType,
          feeTier: unparseFeeAmount(fee),
          liquidity: liquidity.toString(),
          token0: {
            id: token0.address,
          },
          token1: {
            id: token1.address,
          },
          // As a very rough proxy we just use liquidity for TVL.
          tvlETH: liquidityNumber,
          tvlUSD: liquidityNumber,
        };
      })
      .compact()
      .value();

    return subgraphPools;
  }
}
