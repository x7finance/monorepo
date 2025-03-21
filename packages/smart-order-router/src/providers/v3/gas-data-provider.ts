/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { getContract } from "viem";

import type { ChainId } from "@x7/utils";

import { gasDataArbABI } from "../../abis/gasDataArbitrum";
import type { ViemProviderType } from "../../utils";
import type { ProviderConfig } from "../provider";

const ARB_GASINFO_ADDRESS = "0x000000000000000000000000000000000000006C";

export interface OptimismGasData {
  l1BaseFee: bigint;
  baseFeeScalar: bigint;
  blobBaseFeeScalar: bigint;
  blobBaseFee: bigint;
  baseFee: bigint;
  scalar: bigint;
  decimals: bigint;
  overhead: bigint;
}

/**
 * Provider for getting gas constants on L2s.
 *
 * @export
 * @interface IL2GasDataProvider
 */
export interface IL2GasDataProvider<T> {
  /**
   * Gets the data constants needed to calculate the l1 security fee on L2s like arbitrum and optimism.
   * @returns An object that includes the data necessary for the off chain estimations.
   */
  getGasData(providerConfig?: ProviderConfig): Promise<T>;
}

/**
 * perL2TxFee is the base fee in wei for an l2 transaction.
 * perL2CalldataFee is the fee in wei per byte of calldata the swap uses. Multiply by the total bytes of the calldata.
 * perArbGasTotal is the fee in wei per unit of arbgas. Multiply this by the estimate we calculate based on ticks/hops in the gasModel.
 */
export interface ArbitrumGasData {
  perL2TxFee: bigint;
  perL1CalldataFee: bigint;
  perArbGasTotal: bigint;
}

export class ArbitrumGasDataProvider
  implements IL2GasDataProvider<ArbitrumGasData>
{
  protected gasFeesAddress: string;
  protected blockNumberOverride: number | Promise<number> | undefined;

  constructor(
    protected chainId: ChainId,
    protected provider: ViemProviderType,
    gasDataAddress?: string,
  ) {
    this.gasFeesAddress = gasDataAddress ? gasDataAddress : ARB_GASINFO_ADDRESS;
  }

  public async getGasData() {
    const gasDataContract = getContract({
      address: this.gasFeesAddress as `0x${string}`,
      abi: gasDataArbABI,
      client: {
        public: this.provider,
        wallet: this.provider,
      },
    });

    const gasData: readonly [bigint, bigint, bigint, bigint, bigint, bigint] =
      await gasDataContract.read.getPricesInWei();

    return {
      perL2TxFee: BigInt(gasData[0]),
      perL1CalldataFee: BigInt(gasData[1]),
      perArbGasTotal: BigInt(gasData[5]),
    };
  }
}
