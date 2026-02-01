/* oxlint-disable @typescript-eslint/restrict-template-expressions */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { getContract } from "viem";

import { generateRouterAddress } from "@x7/sdk";
import { LogCodes, PERMIT2_ADDRESS, TradeType } from "@x7/utils";
import type { ChainId, Implementation } from "@x7/utils";

import { erc20ABI } from "../abis/erc20";
import { permit2ABI } from "../abis/Permit2";
import type { SwapOptions, SwapRoute } from "../routers/router";
import { SwapType } from "../routers/router";
import type { CurrencyAmount } from "../utils/amounts";
import type { ViemProviderType } from "../utils/viemHelpers";
import { log } from "../utils/log";
import type { IPortionProvider } from "./portion-provider";
import type { ProviderConfig } from "./provider";
import type { ArbitrumGasData, OptimismGasData } from "./v3/gas-data-provider";

export interface SimulationResult {
  transaction: {
    hash: string;
    gas_used: number;
    gas: number;
    error_message: string;
  };
  simulation: { state_overrides: Record<string, unknown> };
}

// Import and re-export from simulation-types for backwards compatibility
import { SimulationStatus } from "./simulation-types";
export { SimulationStatus };

/**
 * Provider for dry running transactions.
 *
 * @export
 * @class Simulator
 */
export abstract class Simulator {
  protected provider: ViemProviderType;
  protected portionProvider: IPortionProvider;

  /**
   * Returns a new SwapRoute with simulated gas estimates
   * @returns SwapRoute
   */
  constructor(
    provider: ViemProviderType,
    portionProvider: IPortionProvider,
    protected chainId: ChainId,
  ) {
    this.provider = provider;
    this.portionProvider = portionProvider;
  }

  public async simulate(
    fromAddress: string,
    swapOptions: SwapOptions,
    swapRoute: SwapRoute,
    amount: CurrencyAmount,
    quote: CurrencyAmount,
    l2GasData?: OptimismGasData | ArbitrumGasData,
    providerConfig?: ProviderConfig,
  ): Promise<SwapRoute> {
    if (
      await this.userHasSufficientBalance(
        fromAddress,
        swapRoute.trade.tradeType,
        amount,
        quote,
      )
    ) {
      try {
        return this.simulateTransaction(
          fromAddress,
          swapOptions,
          swapRoute,
          l2GasData,
          providerConfig,
        );
      } catch (e) {
        log.error(LogCodes.FAIL, "Error simulating transaction", { e });
        return {
          ...swapRoute,
          simulationStatus: SimulationStatus.Failed,
        };
      }
    } else {
      log.error(
        LogCodes.FAIL,
        "User does not have sufficient balance to simulate.",
      );
      return {
        ...swapRoute,
        simulationStatus: SimulationStatus.InsufficientBalance,
      };
    }
  }

  protected abstract simulateTransaction(
    fromAddress: string,
    swapOptions: SwapOptions,
    swapRoute: SwapRoute,
    l2GasData?: OptimismGasData | ArbitrumGasData,
    providerConfig?: ProviderConfig,
  ): Promise<SwapRoute>;

  protected async userHasSufficientBalance(
    fromAddress: string,
    tradeType: TradeType,
    amount: CurrencyAmount,
    quote: CurrencyAmount,
  ): Promise<boolean> {
    try {
      const neededBalance = tradeType === TradeType.EXACT_INPUT ? amount : quote;
      let balance;
      if (neededBalance.currency.isNative) {
        balance = BigInt(
          await this.provider.getBalance({
            address: fromAddress as `0x${string}`,
          }),
        );
      } else {
        const tokenContract = getContract({
          address: neededBalance.currency.address,
          abi: erc20ABI,
          client: {
            public: this.provider,
          },
        });

        balance = BigInt(
          await tokenContract.read.balanceOf([fromAddress as `0x${string}`]),
        );
      }

      const hasBalance =
        balance >= BigInt(BigInt(neededBalance.quotient.toString()));
      // log.info(
      //   {
      //     fromAddress,
      //     balance: balance.toString(),
      //     neededBalance: neededBalance.quotient.toString(),
      //     neededAddress: neededBalance.wrapped.currency.address,
      //     hasBalance,
      //   },
      //   "Result of balance check for simulation",
      // );
      return hasBalance;
    } catch (e) {
      log.error(LogCodes.FAIL, "Error while checking user balance", e);
      return false;
    }
  }

  protected async checkTokenApproved(
    fromAddress: string,
    inputAmount: CurrencyAmount,
    swapOptions: SwapOptions,
    provider: ViemProviderType,
    implementation: Implementation,
  ): Promise<boolean> {
    // Check token has approved Permit2 more than expected amount.

    const tokenContract = getContract({
      address: inputAmount.currency.wrapped.address,
      abi: erc20ABI,
      client: {
        public: this.provider,
      },
    });

    if (swapOptions.type === SwapType.UNIVERSAL_ROUTER) {
      const result: bigint = await tokenContract.read.allowance([
        fromAddress as `0x${string}`,
        PERMIT2_ADDRESS,
      ]);

      // If a permit has been provided we don't need to check if UR has already been allowed.
      if (swapOptions.inputTokenPermit) {
        log.info(
          LogCodes.CHECK_PERMIT,
          "Permit was provided for simulation on UR, checking that Permit2 has been approved.",
          {
            permitAllowance: result.toString(),
            inputAmount: inputAmount.quotient.toString(),
          },
        );

        return BigInt(result) >= BigInt(inputAmount.quotient.toString());
      }

      // Check UR has been approved from Permit2.

      const permit2Contract = getContract({
        address: PERMIT2_ADDRESS,
        abi: permit2ABI,
        client: {
          public: provider,
        },
      });

      const [universalRouterAllowance, tokenExpiration, _nonce] =
        await permit2Contract.read.allowance([
          fromAddress as `0x${string}`,
          inputAmount.currency.wrapped.address,
          // TODO: Possibly need this to be interchangable between, its just the simulator tho
          generateRouterAddress(this.chainId, implementation),
        ]);

      const nowTimestampS = Math.round(Date.now() / 1000);
      const inputAmountBN = BigInt(inputAmount.quotient.toString());

      const permit2Approved = BigInt(result) >= BigInt(inputAmountBN);
      const universalRouterApproved = universalRouterAllowance > inputAmountBN;
      const expirationValid = tokenExpiration > nowTimestampS;
      log.info(
        LogCodes.SIMULATE,
        {
          permitAllowance: BigInt(result).toString(),
          tokenAllowance: universalRouterAllowance.toString(),
          tokenExpirationS: tokenExpiration,
          nowTimestampS,
          inputAmount: inputAmount.quotient.toString(),
          permit2Approved,
          universalRouterApproved,
          expirationValid,
        },
        `Simulating on UR, Permit2 approved: ${permit2Approved}, UR approved: ${universalRouterApproved}, Expiraton valid: ${expirationValid}.`,
      );
      return permit2Approved && universalRouterApproved && expirationValid;
    } else if (swapOptions.type === SwapType.SWAP_ROUTER_02) {
      if (swapOptions.inputTokenPermit) {
        log.info(
          LogCodes.SIMULATE,
          {
            inputAmount: inputAmount.quotient.toString(),
          },
          "Simulating on SwapRouter02 info - Permit was provided for simulation. Not checking allowances.",
        );
        return true;
      }

      const allowance: bigint = await tokenContract.read.allowance([
        fromAddress as `0x${string}`,
        // TODO: Possibly need this to be interchangable between, its just the simulator tho
        generateRouterAddress(this.chainId, implementation),
      ]);
      const hasAllowance =
        BigInt(allowance) >= BigInt(inputAmount.quotient.toString());

      log.info(
        LogCodes.SIMULATE,
        {
          hasAllowance,
          allowance: allowance.toString(),
          inputAmount: inputAmount.quotient.toString(),
        },
        `Simulating on SwapRouter02 - Has allowance: ${hasAllowance}`,
      );
      // Return true if token allowance is greater than input amount
      return hasAllowance;
    }

    throw new Error(`Unsupported swap type ${swapOptions}`);
  }
}
