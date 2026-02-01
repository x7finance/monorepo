/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback } from "react";
import {
  keepPreviousData as _keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import type { Config } from "@wagmi/core";
import { getToken as fetchToken } from "@wagmi/core";
import { isAddress } from "viem";
import type { Address } from "viem";

import { getToken, saveTokens } from "@x7/dexie";
import type { ChainId } from "@x7/utils";
import { Token } from "@x7/utils";

import { useWeb3Config } from "~/lib/providers/web3";
import { useCustomTokens } from "./useCustomTokens";

interface UseTokenParams<T extends boolean> {
  chainId: ChainId | undefined;
  address: string | undefined | null;
  withStatus?: T;
  enabled?: boolean;
  keepPreviousData?: boolean;
}

type UseTokenReturn<T> = T extends true
  ? { token: Token; status: "UNKNOWN" | "APPROVED" | "DISAPPROVED" }
  : Token;

interface Data {
  id: string;
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  status: "UNKNOWN" | "APPROVED" | "DISAPPROVED";
}

export const getTokenWithQueryCacheHydrate = <T extends boolean>(
  chainId: ChainId | undefined,
  data: Data,
  withStatus: T | undefined,
): UseTokenReturn<T> | undefined => {
  if (data && chainId) {
    const { address, name, symbol, decimals } = data;
    const token = new Token({
      chainId,
      name,
      decimals,
      symbol,
      address,
    });

    if (withStatus) {
      return {
        token,
        status: data.status,
      } as UseTokenReturn<T>;
    }

    return token as UseTokenReturn<T>;
  }

  return undefined;
};

interface GetTokenWithQueryCacheFn {
  chainId: ChainId | undefined;
  address: string | undefined | null;
  customTokens: Record<string, Token>;
  hasToken: (cur: string | Token) => boolean;
  config: Config;
}

export const getTokenWithCacheQueryFn = async ({
  chainId,
  address,
  customTokens,
  hasToken,
  config,
}: GetTokenWithQueryCacheFn) => {
  // Try fetching from localStorage
  if (chainId && hasToken(`${chainId}:${address}`)) {
    const {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      id,
    }: any = customTokens[`${chainId}:${address}`];
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      status: "UNKNOWN",
      id,
    } as Data;
  }

  // Try fetching from dexie
  const token = await getToken({ chainId, address });

  if (token) {
    return token as Data;
  }

  // Try fetching from wagmi
  if (chainId) {
    const resp = await fetchToken(config, {
      address: address as Address,
      chainId,
    });
    const { decimals, address: tokenAddress, symbol, name } = resp;

    await saveTokens({
      tokens: [
        {
          address: tokenAddress,
          chainId: Number(chainId),
          name: name!,
          symbol: symbol!,
          decimals,
          status: "UNKNOWN",
          id: `${chainId}:${tokenAddress}`,
        },
      ],
    });

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      status: "UNKNOWN",
      id: `${chainId}:${tokenAddress}`,
    } as Data;
  } else {
    throw Error("Could not fetch token");
  }
};

export const useTokenWithCache = <T extends boolean = false>({
  chainId,
  address,
  withStatus,
  enabled = true,
  keepPreviousData = true,
}: UseTokenParams<T>) => {
  const { data: customTokens, hasToken } = useCustomTokens();
  const { wagmiConfig: config } = useWeb3Config();
  const select = useCallback(
    (data: Data) => getTokenWithQueryCacheHydrate<T>(chainId, data, withStatus),
    [chainId, withStatus],
  );

  return useQuery({
    queryKey: ["token", { chainId, address }],
    queryFn: async () =>
      getTokenWithCacheQueryFn({
        chainId,
        address,
        customTokens,
        hasToken,
        config,
      }),
    enabled: Boolean(enabled && chainId && address && isAddress(address)),
    select,
    placeholderData: keepPreviousData ? _keepPreviousData : undefined,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  });
};
