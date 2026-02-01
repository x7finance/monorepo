/* oxlint-disable @typescript-eslint/unbound-method */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable no-unsafe-optional-chaining */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unused-vars */

import type { FC } from "react";
import { useEffect, useState } from "react";
import { getPublicClient } from "@wagmi/core";

import { PairsAbi } from "@x7/contracts";
import { computePairAddress, Pair } from "@x7/sdk";
import type { Currency } from "@x7/utils";
import { CurrencyAmount, Implementation } from "@x7/utils";

import { useWeb3Config } from "~/lib/providers/web3";
import type { XchangeV2PoolFinderProps } from "./types";
import { PoolFinderType, XchangeV2PoolState } from "./types";

export const useXChangePool = (token1: Currency, token0: Currency) => {
  const { wagmiConfig } = useWeb3Config();
  const publicClient = getPublicClient(wagmiConfig);
  const [pool, setPool] = useState<Pair | null>();

  useEffect(() => {
    async function setup() {
      const address = computePairAddress({
        pairType: Implementation.XCHANGE,
        tokenA: token0.isNative ? token0.wrapped : token0,
        tokenB: token1.isNative ? token1.wrapped : token1,
      });

      try {
        const [reserve0, reserve1]: any = await publicClient?.readContract({
          address: address,
          abi: PairsAbi,
          functionName: "getReserves",
        });

        if (reserve0 > 0n && reserve1 > 0n) {
          setPool(
            new Pair(
              CurrencyAmount.fromRawAmount(token0.wrapped, BigInt(reserve0)),
              CurrencyAmount.fromRawAmount(token1.wrapped, BigInt(reserve1)),
              Implementation.XCHANGE,
            ),
          );
        } else {
          setPool(null);
        }
      } catch (error) {
        setPool(null);
      }
    }

    if (publicClient && !pool && !!token0 && !!token1) {
      void setup();
    }

    if (
      pool &&
      (!pool.involvesToken(token0.wrapped) ||
        !pool.involvesToken(token1.wrapped))
    ) {
      void setup();
    }
  }, [token0, token1, publicClient, pool]);

  return {
    pool,
    poolState: pool ? XchangeV2PoolState.EXISTS : XchangeV2PoolState.NOT_EXISTS,
  };
};

export const XchangeV2Pool: FC<XchangeV2PoolFinderProps> = ({
  dispatch,
  token0,
  token1,
  index,
}) => {
  const { pool } = useXChangePool(token0!, token1!);

  useEffect(() => {
    if (!dispatch || index === undefined) return;

    dispatch({
      type: "update",
      payload: {
        state: [
          pool ? XchangeV2PoolState.EXISTS : XchangeV2PoolState.NOT_EXISTS,
          pool,
        ],
        index,
        poolType: PoolFinderType.Classic,
      },
    });

    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, index]);

  return <></>;
};
