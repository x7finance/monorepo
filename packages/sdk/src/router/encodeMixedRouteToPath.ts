import { encodePacked } from "viem";

import type { Currency, Token } from "@x7/utils";

import type { Pair } from "../v2";
import { Pool } from "../v3";
import type { MixedRouteSDK } from "./entities/mixedRoute/route";

const V2_FEE_PATH_PLACEHOLDER = 8388608;

/**
 * Converts a route to a hex encoded path
 * @notice only supports exactIn route encodings
 * @param route the mixed path to convert to an encoded path
 * @returns the exactIn encoded path
 */
export function encodeMixedRouteToPath(
  route: MixedRouteSDK<Currency, Currency>,
): string {
  const firstInputToken: Token = route.input.wrapped;

  const { path, types } = route.pools.reduce(
    (
      {
        inputToken,
        path,
        types,
      }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool | Pair,
      index,
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken: Token = pool.token0.equals(inputToken)
        ? pool.token1
        : pool.token0;
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ["address", "uint24", "address"],
          path: [
            inputToken.address,
            pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER,
            outputToken.address,
          ],
        };
      } else {
        return {
          inputToken: outputToken,
          types: [...types, "uint24", "address"],
          path: [
            ...path,
            pool instanceof Pool ? pool.fee : V2_FEE_PATH_PLACEHOLDER,
            outputToken.address,
          ],
        };
      }
    },
    { inputToken: firstInputToken, path: [], types: [] },
  );

  return encodePacked(types, path);
}
