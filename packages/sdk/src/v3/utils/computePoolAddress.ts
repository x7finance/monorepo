/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  encodeAbiParameters,
  getContractAddress,
  keccak256,
  parseAbiParameters,
} from "viem";

import type { Token } from "@x7/utils";

import type { FeeAmount } from "../constants";
import { POOL_INIT_CODE_HASH } from "../constants";

/**
 * Computes a pool address
 * @param factoryAddress The Uniswap V3 factory address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @param fee The fee tier of the pool
 * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
 * @returns The pool address
 */
export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  initCodeHashManualOverride,
}: {
  factoryAddress: string;
  tokenA: Token;
  tokenB: Token;
  fee: FeeAmount;
  initCodeHashManualOverride?: string;
}): `0x${string}` {
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]; // does safety checks

  const initHash = initCodeHashManualOverride || POOL_INIT_CODE_HASH;

  return getContractAddress({
    bytecodeHash: initHash as `0x${string}`,
    from: factoryAddress as `0x${string}`,
    opcode: "CREATE2",
    salt: keccak256(
      encodeAbiParameters(parseAbiParameters("address, address, uint24"), [
        token0.address,
        token1.address,
        fee,
      ]),
      "hex",
    ),
  });
}
