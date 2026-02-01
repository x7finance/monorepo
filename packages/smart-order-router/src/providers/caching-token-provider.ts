/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import _ from "lodash";

import type { Token } from "@x7/utils";
import { ChainId, LogCodes } from "@x7/utils";

import { log, WRAPPED_NATIVE_CURRENCY } from "../utils";
import type { ICache } from "./cache";
import type { ITokenProvider, TokenAccessor } from "./token-provider";
import {
  BTC_BNB,
  BUSD_BNB,
  DAI_ARBITRUM,
  DAI_BNB,
  DAI_MAINNET,
  DAI_OPTIMISM,
  DAI_POLYGON_MUMBAI,
  ETH_BNB,
  USDC_ARBITRUM,
  USDC_ARBITRUM_TESTNET,
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
  WBTC_MAINNET,
  WBTC_OPTIMISM,
  WMATIC_POLYGON,
  WMATIC_POLYGON_MUMBAI,
} from "./token-provider";

// These tokens will added to the Token cache on initialization.
export const CACHE_SEED_TOKENS: Partial<
  Record<ChainId, Record<string, Token>>
> = {
  [ChainId.ETHEREUM]: {
    WETH: WRAPPED_NATIVE_CURRENCY[ChainId.ETHEREUM],
    USDC: USDC_MAINNET,
    USDT: USDT_MAINNET,
    WBTC: WBTC_MAINNET,
    DAI: DAI_MAINNET,
  },
  [ChainId.ETHEREUM_TESTNET]: {
    USDC: USDC_SEPOLIA,
  },
  [ChainId.OPTIMISM]: {
    USDC: USDC_OPTIMISM,
    USDT: USDT_OPTIMISM,
    WBTC: WBTC_OPTIMISM,
    DAI: DAI_OPTIMISM,
  },
  [ChainId.ARBITRUM]: {
    USDC: USDC_ARBITRUM,
    USDT: USDT_ARBITRUM,
    WBTC: WBTC_ARBITRUM,
    DAI: DAI_ARBITRUM,
  },
  [ChainId.ARBITRUM_TESTNET]: {
    USDC: USDC_ARBITRUM_TESTNET,
  },
  [ChainId.POLYGON]: {
    WMATIC: WMATIC_POLYGON,
    USDC: USDC_POLYGON,
  },
  [ChainId.POLYGON_TESTNET]: {
    WMATIC: WMATIC_POLYGON_MUMBAI,
    DAI: DAI_POLYGON_MUMBAI,
  },

  [ChainId.BSC]: {
    USDC: USDC_BNB,
    USDT: USDT_BNB,
    BUSD: BUSD_BNB,
    ETH: ETH_BNB,
    DAI: DAI_BNB,
    BTC: BTC_BNB,
    WBNB: WRAPPED_NATIVE_CURRENCY[ChainId.BSC],
  },

  [ChainId.BASE]: {
    USDC: USDC_BASE,
    WETH: WRAPPED_NATIVE_CURRENCY[ChainId.BASE],
  },
  // Currently we do not have providers for Moonbeam mainnet or Gnosis testnet
};

/**
 * Provider for getting token metadata that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class CachingTokenProviderWithFallback
 */
export class CachingTokenProviderWithFallback implements ITokenProvider {
  private CACHE_KEY = (chainId: ChainId, address: string) =>
    `token-${chainId}-${address}`;

  constructor(
    protected chainId: ChainId,
    // Token metadata (e.g. symbol and decimals) don't change so can be cached indefinitely.
    // Constructing a new token object is slow as sdk-core does checksumming.
    private tokenCache: ICache<Token>,
    protected primaryTokenProvider: ITokenProvider,
    protected fallbackTokenProvider?: ITokenProvider,
  ) {}

  public async getTokens(_addresses: string[]): Promise<TokenAccessor> {
    const seedTokens = CACHE_SEED_TOKENS[this.chainId];

    if (seedTokens) {
      await Promise.all(
        Object.values(seedTokens).map((token) =>
          this.tokenCache.set(
            this.CACHE_KEY(this.chainId, token.address.toLowerCase()),
            token,
          ),
        ),
      );
    }

    const addressToToken: Record<string, Token> = {};
    const symbolToToken: Record<string, Token> = {};

    const addresses = _(_addresses)
      .map((address) => address.toLowerCase())
      .uniq()
      .value();

    const addressesToFindInPrimary = [];
    const addressesToFindInSecondary = [];

    for (const address of addresses) {
      if (await this.tokenCache.has(this.CACHE_KEY(this.chainId, address))) {
        addressToToken[address.toLowerCase()] = (await this.tokenCache.get(
          this.CACHE_KEY(this.chainId, address),
        ))!;
        symbolToToken[addressToToken[address]!.symbol!] =
          (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)))!;
      } else {
        addressesToFindInPrimary.push(address);
      }
    }

    log.info(
      LogCodes.CACHE_HIT,
      `Found ${addresses.length - addressesToFindInPrimary.length} out of ${
        addresses.length
      } tokens in local cache. ${
        addressesToFindInPrimary.length > 0
          ? `Checking primary token provider for ${addressesToFindInPrimary.length} tokens`
          : ``
      }
      `,
      { addressesToFindInPrimary },
    );

    if (addressesToFindInPrimary.length > 0) {
      const primaryTokenAccessor = await this.primaryTokenProvider.getTokens(
        addressesToFindInPrimary,
      );

      for (const address of addressesToFindInPrimary) {
        const token = primaryTokenAccessor.getTokenByAddress(address);

        if (token) {
          addressToToken[address.toLowerCase()] = token;
          symbolToToken[addressToToken[address]!.symbol!] = token;
          await this.tokenCache.set(
            this.CACHE_KEY(this.chainId, address.toLowerCase()),
            addressToToken[address]!,
          );
        } else {
          addressesToFindInSecondary.push(address);
        }
      }

      log.info(
        LogCodes.CACHE_HIT,
        { addressesToFindInSecondary },
        `Found ${
          addressesToFindInPrimary.length - addressesToFindInSecondary.length
        } tokens in primary. ${
          this.fallbackTokenProvider
            ? `Checking secondary token provider for ${addressesToFindInSecondary.length} tokens`
            : `No fallback token provider specified. About to return.`
        }`,
      );
    }

    if (this.fallbackTokenProvider && addressesToFindInSecondary.length > 0) {
      const secondaryTokenAccessor = await this.fallbackTokenProvider.getTokens(
        addressesToFindInSecondary,
      );

      for (const address of addressesToFindInSecondary) {
        const token = secondaryTokenAccessor.getTokenByAddress(address);
        if (token) {
          addressToToken[address.toLowerCase()] = token;
          symbolToToken[addressToToken[address]!.symbol!] = token;
          await this.tokenCache.set(
            this.CACHE_KEY(this.chainId, address.toLowerCase()),
            addressToToken[address]!,
          );
        }
      }
    }

    return {
      getTokenByAddress: (address: string): Token | undefined => {
        return addressToToken[address.toLowerCase()];
      },
      getTokenBySymbol: (symbol: string): Token | undefined => {
        return symbolToToken[symbol.toLowerCase()];
      },
      getAllTokens: (): Token[] => {
        return Object.values(addressToToken);
      },
    };
  }
}
