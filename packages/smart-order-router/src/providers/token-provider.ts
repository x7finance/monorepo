/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/restrict-template-expressions */
import _ from "lodash"
import type { Abi } from "viem"
import { hexToString } from "viem"

import {
  AAVE_ADDRESS,
  DAI_ADDRESS,
  LDO_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WBTC_ADDRESS,
} from "@x7/sdk"
import { ChainId, LogCodes, Token, WRAPPED_CONTRACTS } from "@x7/utils"

import { erc20ABI } from "../abis/erc20"
import { log } from "../utils"

import type { IMulticallProvider, Result } from "./multicall-provider"
import type { ProviderConfig } from "./provider"

/**
 * Provider for getting token data.
 *
 * @export
 * @interface ITokenProvider
 */
export interface ITokenProvider {
  /**
   * Gets the token at each address. Any addresses that are not valid ERC-20 are ignored.
   *
   * @param addresses The token addresses to get.
   * @param [providerConfig] The provider config.
   * @returns A token accessor with methods for accessing the tokens.
   */
  getTokens(
    addresses: string[],
    providerConfig?: ProviderConfig
  ): Promise<TokenAccessor>
}

export interface TokenAccessor {
  getTokenByAddress(address: string): Token | undefined
  getTokenBySymbol(symbol: string): Token | undefined
  getAllTokens: () => Token[]
}

// Some well known tokens on each chain for seeding cache / testing.
// TODO: doc go through these
export const USDC_MAINNET = new Token({
  chainId: ChainId.ETHEREUM,
  address: USDC_ADDRESS[ChainId.ETHEREUM],
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})
export const USDT_MAINNET = new Token({
  chainId: ChainId.ETHEREUM,
  address: USDT_ADDRESS[ChainId.ETHEREUM],
  decimals: 6,
  symbol: "USDT",
  name: "Tether USD",
})
export const WBTC_MAINNET = new Token({
  chainId: ChainId.ETHEREUM,
  address: WBTC_ADDRESS[ChainId.ETHEREUM],
  decimals: 8,
  symbol: "WBTC",
  name: "Wrapped BTC",
})
export const DAI_MAINNET = new Token({
  chainId: ChainId.ETHEREUM,
  address: DAI_ADDRESS[ChainId.ETHEREUM],
  decimals: 18,
  symbol: "DAI",
  name: "Dai Stablecoin",
})
export const AAVE_MAINNET = new Token({
  chainId: ChainId.ETHEREUM,
  address: AAVE_ADDRESS[ChainId.ETHEREUM],
  decimals: 18,
  symbol: "AAVE",
  name: "Aave Token",
})

export const LIDO_MAINNET = new Token({
  chainId: ChainId.ETHEREUM,
  address: LDO_ADDRESS[ChainId.ETHEREUM],
  decimals: 18,
  symbol: "LDO",
  name: "Lido DAO Token",
})

export const USDC_SEPOLIA = new Token({
  chainId: ChainId.ETHEREUM_TESTNET,
  address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  decimals: 18,
  symbol: "USDC",
  name: "USDC Token",
})
export const DAI_SEPOLIA = new Token({
  chainId: ChainId.ETHEREUM_TESTNET,
  address: "0x7AF17A48a6336F7dc1beF9D485139f7B6f4FB5C8",
  decimals: 18,
  symbol: "DAI",
  name: "DAI Token",
})

export const USDC_OPTIMISM = new Token({
  chainId: ChainId.OPTIMISM,
  address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})
export const USDC_NATIVE_OPTIMISM = new Token({
  chainId: ChainId.OPTIMISM,
  address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})

export const DAI_OPTIMISM_SEPOLIA = new Token({
  chainId: ChainId.OPTIMISM_TESTNET,
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  decimals: 18,
  symbol: "DAI",
  name: "Dai Stablecoin",
})

export const USDC_OPTIMISM_SEPOLIA = new Token({
  chainId: ChainId.OPTIMISM_TESTNET,
  address: "0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})

export const USDT_OPTIMISM_SEPOLIA = new Token({
  chainId: ChainId.OPTIMISM_TESTNET,
  address: "0x853eb4bA5D0Ba2B77a0A5329Fd2110d5CE149ECE",
  decimals: 6,
  symbol: "USDT",
  name: "Tether USD",
})

export const USDT_OPTIMISM = new Token({
  chainId: ChainId.OPTIMISM,
  address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  decimals: 6,
  symbol: "USDT",
  name: "Tether USD",
})
export const WBTC_OPTIMISM = new Token({
  chainId: ChainId.OPTIMISM,
  address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
  decimals: 8,
  symbol: "WBTC",
  name: "Wrapped BTC",
})
export const DAI_OPTIMISM = new Token({
  chainId: ChainId.OPTIMISM,
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  decimals: 18,
  symbol: "DAI",
  name: "Dai Stablecoin",
})
export const OP_OPTIMISM = new Token({
  chainId: ChainId.OPTIMISM,
  address: "0x4200000000000000000000000000000000000042",
  decimals: 18,
  symbol: "OP",
  name: "Optimism",
})

export const USDC_ARBITRUM = new Token({
  chainId: ChainId.ARBITRUM,
  address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})
export const USDC_NATIVE_ARBITRUM = new Token({
  chainId: ChainId.ARBITRUM,
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})
export const USDT_ARBITRUM = new Token({
  chainId: ChainId.ARBITRUM,
  address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  decimals: 6,
  symbol: "USDT",
  name: "Tether USD",
})
export const WBTC_ARBITRUM = new Token({
  chainId: ChainId.ARBITRUM,
  address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  decimals: 8,
  symbol: "WBTC",
  name: "Wrapped BTC",
})
export const DAI_ARBITRUM = new Token({
  chainId: ChainId.ARBITRUM,
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  decimals: 18,
  symbol: "DAI",
  name: "Dai Stablecoin",
})

export const ARB_ARBITRUM = new Token({
  chainId: ChainId.ARBITRUM,
  address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
  decimals: 18,
  symbol: "ARB",
  name: "Arbitrum",
})

export const USDC_ARBITRUM_TESTNET = new Token({
  chainId: ChainId.ARBITRUM_TESTNET,
  address: "0xf3c3351d6bd0098eeb33ca8f830faf2a141ea2e1",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})

//polygon tokens
export const WMATIC_POLYGON = new Token({
  chainId: ChainId.POLYGON,
  address: WRAPPED_CONTRACTS.WMATIC,
  decimals: 18,
  symbol: "WMATIC",
  name: "Wrapped MATIC",
})
export const USDT_POLYGON = new Token({
  chainId: ChainId.POLYGON,
  address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  symbol: "USDT",
  name: "Tether",
})
export const WETH_POLYGON = new Token({
  chainId: ChainId.POLYGON,
  address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  decimals: 18,
  symbol: "WETH",
  name: "Wrapped Ether",
})

export const USDC_POLYGON = new Token({
  chainId: ChainId.POLYGON,
  address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})

export const DAI_POLYGON = new Token({
  chainId: ChainId.POLYGON,
  address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  decimals: 18,
  symbol: "DAI",
  name: "Dai Stablecoin",
})

//polygon mumbai tokens
export const WMATIC_POLYGON_MUMBAI = new Token({
  chainId: ChainId.POLYGON_TESTNET,
  address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  decimals: 18,
  symbol: "WMATIC",
  name: "Wrapped MATIC",
})

export const USDC_POLYGON_MUMBAI = new Token({
  chainId: ChainId.POLYGON_TESTNET,
  address: "0xe11a86849d99f524cac3e7a0ec1241828e332c62",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
})

export const DAI_POLYGON_MUMBAI = new Token({
  chainId: ChainId.POLYGON_TESTNET,
  address: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f",
  decimals: 18,
  symbol: "DAI",
  name: "Dai Stablecoin",
})

export const WETH_POLYGON_MUMBAI = new Token({
  chainId: ChainId.POLYGON_TESTNET,
  address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
  decimals: 18,
  symbol: "WETH",
  name: "Wrapped Ether",
})

// BNB chain Tokens
export const BTC_BNB = new Token({
  chainId: ChainId.BSC,
  address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
  decimals: 18,
  symbol: "BTCB",
  name: "Binance BTC",
})

export const BUSD_BNB = new Token({
  chainId: ChainId.BSC,
  address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  decimals: 18,
  symbol: "BUSD",
  name: "BUSD",
})

export const DAI_BNB = new Token({
  chainId: ChainId.BSC,
  address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
  decimals: 18,
  symbol: "DAI",
  name: "DAI",
})

export const ETH_BNB = new Token({
  chainId: ChainId.BSC,
  address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  decimals: 18,
  symbol: "ETH",
  name: "ETH",
})

export const USDC_BNB = new Token({
  chainId: ChainId.BSC,
  address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  decimals: 18,
  symbol: "USDC",
  name: "USDC",
})

export const USDT_BNB = new Token({
  chainId: ChainId.BSC,
  address: "0x55d398326f99059fF775485246999027B3197955",
  decimals: 18,
  symbol: "USDT",
  name: "USDT",
})

export const USDC_BASE = new Token({
  chainId: ChainId.BASE,
  address: USDC_ADDRESS[ChainId.BASE],
  decimals: 6,
  symbol: "USDC", // "USDbC",
  name: "USDC",
})

export const USDC_BASE_SEPOLIA = new Token({
  chainId: ChainId.BASE_TESTNET,
  address: USDC_ADDRESS[ChainId.BASE_TESTNET],
  decimals: 6,
  symbol: "USDC", //"USDbC",
  name: "USDC",
})

export const USDC_NATIVE_BASE = new Token({
  chainId: ChainId.BASE,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  decimals: 6,
  symbol: "USDbC",
  name: "USD Base Coin",
})

export class TokenProvider implements ITokenProvider {
  constructor(
    private chainId: ChainId,
    protected multicall2Provider: IMulticallProvider
  ) {}

  private async getTokenSymbol(
    addresses: string[],
    providerConfig?: ProviderConfig
  ): Promise<{
    result: {
      blockNumber: bigint
      results: Result<[string]>[]
    }
    isBytes32: boolean
  }> {
    let result
    let isBytes32 = false

    try {
      result =
        await this.multicall2Provider.callSameFunctionOnMultipleContracts<
          undefined,
          [string]
        >({
          addresses,
          contractInterface: erc20ABI,
          functionName: "symbol",
          providerConfig,
        })
    } catch (err) {
      log.error(
        LogCodes.TOKEN_FETCH_ERROR,
        `TokenProvider.getTokenSymbol[string] failed with error ${err}. Trying with bytes32.`,
        { error: err },
        { addresses }
      )

      const bytes32ABI = JSON.stringify([
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ])

      try {
        result =
          await this.multicall2Provider.callSameFunctionOnMultipleContracts<
            undefined,
            [string]
          >({
            addresses,
            contractInterface: bytes32ABI as unknown as Abi,
            functionName: "symbol",
            providerConfig,
          })
        isBytes32 = true
      } catch (error) {
        log.error(
          LogCodes.TOKEN_FETCH_ERROR,
          `TokenProvider.getTokenSymbol[bytes32] failed with error ${error}.`,
          { error },
          { addresses }
        )

        throw new Error(
          "[TokenProvider.getTokenSymbol] Impossible to fetch token symbol.",
          { cause: error }
        )
      }
    }

    return { result, isBytes32 }
  }

  private async getTokenDecimals(
    addresses: string[],
    providerConfig?: ProviderConfig
  ) {
    return this.multicall2Provider.callSameFunctionOnMultipleContracts<
      undefined,
      [number]
    >({
      addresses,
      contractInterface: erc20ABI,
      functionName: "decimals",
      providerConfig,
    })
  }

  public async getTokens(
    _addresses: `0x${string}`[],
    providerConfig?: ProviderConfig
  ): Promise<TokenAccessor> {
    const addressToToken: Record<string, Token> = {}
    const symbolToToken: Record<string, Token> = {}

    const addresses = _(_addresses)
      .map((address) => address.toLowerCase())
      .uniq()
      .value() as `0x${string}`[]

    if (addresses.length > 0) {
      const [symbolsResult, decimalsResult] = await Promise.all([
        this.getTokenSymbol(addresses, providerConfig),
        this.getTokenDecimals(addresses, providerConfig),
      ])

      const isBytes32 = symbolsResult.isBytes32
      const { results: symbols } = symbolsResult.result
      const { results: decimals } = decimalsResult

      for (let i = 0; i < addresses.length; i++) {
        const address: `0x${string}` = addresses[i]!

        const symbolResult: Result<any> = symbols[i]!
        const decimalResult = decimals[i]

        if (!symbolResult.success || !decimalResult?.success) {
          continue
        }

        const symbol = isBytes32
          ? hexToString(symbolResult.result, {
              size: 32,
            })
          : symbolResult.result
        const decimal: any = decimalResult.result

        addressToToken[address.toLowerCase()] = new Token({
          chainId: this.chainId,
          address,
          decimals: decimal,
          symbol,
          name: "",
        })

        symbolToToken[symbol.toLowerCase()] =
          addressToToken[address.toLowerCase()]!
      }
    }

    return {
      getTokenByAddress: (address: string): Token | undefined => {
        return addressToToken[address.toLowerCase()]
      },
      getTokenBySymbol: (symbol: string): Token | undefined => {
        return symbolToToken[symbol.toLowerCase()]
      },
      getAllTokens: (): Token[] => {
        return Object.values(addressToToken)
      },
    }
  }
}
