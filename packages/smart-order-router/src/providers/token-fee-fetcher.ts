/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import retry from "async-retry";

import { FACTORY_ADDRESSES, PAIR_INIT_HASH } from "@x7/sdk";
import type { Implementation } from "@x7/utils";
import { ChainId, LogCodes, Protocol } from "@x7/utils";

import { tokenFeeDetectorABI } from "../abis/TokenFeeDetector";
import type { ViemProviderType } from "../utils";
import {
  log,
  metric,
  MetricLoggerUnit,
  WRAPPED_NATIVE_CURRENCY,
} from "../utils";
import type { IMulticallProvider } from "./multicall-provider";

const DEFAULT_TOKEN_BUY_FEE_BPS = BigInt(0);
const DEFAULT_TOKEN_SELL_FEE_BPS = BigInt(0);

// on detector failure, assume no fee
export const DEFAULT_TOKEN_FEE_RESULT = {
  buyFeeBps: DEFAULT_TOKEN_BUY_FEE_BPS,
  sellFeeBps: DEFAULT_TOKEN_SELL_FEE_BPS,
};

type Address = string;

export interface TokenFeeResult {
  buyFeeBps?: bigint;
  sellFeeBps?: bigint;
}
export type TokenFeeMap = Record<Address, TokenFeeResult>;

const FEE_DETECTOR_ADDRESS =
  "0xd6A4A63d001c60C440297618578071a6F30E577A" as `0x${string}`;

export const FEE_FETCHER_ENABLED_CHAINS: Partial<ChainId>[] = [
  ChainId.ETHEREUM,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
];

// Amount has to be big enough to avoid rounding errors, but small enough that
// most v2 pools will have at least this many token units
// 100000 is the smallest number that avoids rounding errors in bps terms
// 10000 was not sufficient due to rounding errors for rebase token (e.g. stETH)
const AMOUNT_TO_FLASH_BORROW = "100000";
// 1M gas limit per validate call, should cover most swap cases
// const GAS_LIMIT_PER_VALIDATE = 1_000_000;

export interface ITokenFeeFetcher {
  fetchFees(addresses: Address[]): Promise<TokenFeeMap>;
}

export class OnChainTokenFeeFetcher implements ITokenFeeFetcher {
  private BASE_TOKEN: string;
  private readonly provider: ViemProviderType;
  private readonly enabledImplementations: Implementation[];
  constructor(
    private chainId: ChainId,
    rpcProvider: ViemProviderType,
    _enabledImplementations: Implementation[],
    protected multicall2Provider: IMulticallProvider,
    private tokenFeeAddress = FEE_DETECTOR_ADDRESS,
    private amountToFlashBorrow = AMOUNT_TO_FLASH_BORROW,
  ) {
    this.BASE_TOKEN = WRAPPED_NATIVE_CURRENCY[this.chainId].address;
    this.provider = rpcProvider;
    this.enabledImplementations = _enabledImplementations;
  }

  private activeImplementations(chainId: ChainId): Implementation[] {
    const factoryAddresses = FACTORY_ADDRESSES[chainId];
    const pairInitHashes = PAIR_INIT_HASH[chainId];
    const activeImplementations: Implementation[] = [];

    if (factoryAddresses && pairInitHashes) {
      Object.entries(factoryAddresses).forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([implementation, protocols]: any) => {
          if (
            protocols[Protocol.V2] &&
            pairInitHashes[implementation]?.[Protocol.V2] &&
            this.enabledImplementations.includes(implementation)
          ) {
            activeImplementations.push(implementation);
          }
        },
      );
    }

    return activeImplementations;
  }

  public async fetchFees(addresses: Address[]): Promise<TokenFeeMap> {
    const tokenToResult: TokenFeeMap = {};

    const addressesWithoutBaseToken = addresses.filter(
      (address) => address.toLowerCase() !== this.BASE_TOKEN.toLowerCase(),
    );
    const functionParams = this.activeImplementations(this.chainId).flatMap(
      (imp: Implementation) =>
        addressesWithoutBaseToken.map((address) => [
          {
            token: address,
            baseToken: this.BASE_TOKEN,
            amountToBorrow: this.amountToFlashBorrow,
            factory: FACTORY_ADDRESSES[this.chainId][imp][Protocol.V2],
            initCodeHash: PAIR_INIT_HASH[this.chainId][imp][Protocol.V2],
          },
        ]),
    );

    const { results } = await retry(
      async () => {
        return this.multicall2Provider.callSameFunctionOnContractWithMultipleParams(
          {
            address: this.tokenFeeAddress,
            contractInterface: tokenFeeDetectorABI,
            functionName: "validate",
            functionParams,
          },
        );
      },
      {
        retries: 2,
        minTimeout: 50,
        maxTimeout: 500,
      },
    );

    const parsedResults = results.flatMap(
      (result, index): (TokenFeeResult & { address: string })[] => {
        const address = functionParams[index]?.[0]?.token;
        const imp = this.activeImplementations(this.chainId)[
          Math.floor(index / addressesWithoutBaseToken.length)
        ];

        if (result.success && address) {
          metric.putMetric(
            `TokenFeeFetcherFetchFeesSuccess - ${imp} - ${address} - Buy: ${result.result.buyFeeBps} Sell: ${result.result.sellFeeBps}`,
            1,
            MetricLoggerUnit.Count,
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return [{ address, ...result.result }];
        } else {
          log.error(
            LogCodes.FAIL,
            `Error calling validate on-chain for token ${address} - ${imp}`,
          );
          metric.putMetric(
            "TokenFeeFetcherFetchFeesFailure",
            1,
            MetricLoggerUnit.Count,
          );
          return [];
        }
      },
    );

    parsedResults.forEach(({ address, buyFeeBps, sellFeeBps }) => {
      if (buyFeeBps !== undefined || sellFeeBps !== undefined) {
        const currentFee = tokenToResult[address] ?? {
          buyFeeBps: 0n,
          sellFeeBps: 0n,
        };
        tokenToResult[address] = {
          buyFeeBps:
            buyFeeBps !== undefined
              ? (currentFee.buyFeeBps ?? 0n) > buyFeeBps
                ? currentFee.buyFeeBps
                : buyFeeBps
              : currentFee.buyFeeBps,
          sellFeeBps:
            sellFeeBps !== undefined
              ? (currentFee.sellFeeBps ?? 0n) > sellFeeBps
                ? currentFee.sellFeeBps
                : sellFeeBps
              : currentFee.sellFeeBps,
        };
      }
    });

    return tokenToResult;
  }
}
