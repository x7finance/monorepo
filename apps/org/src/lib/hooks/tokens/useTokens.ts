import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Config } from "@wagmi/core";
import { getPublicClient } from "@wagmi/core";
import type { Client } from "viem";
import { erc20Abi, getAddress, getContract } from "viem";

import { tokenRegisteryABI } from "@x7/contracts";
import type { SavedToken, TokenStatus } from "@x7/dexie";
import { saveTokens } from "@x7/dexie";
import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId } from "@x7/utils";
import { LogCodes, Token } from "@x7/utils";

import { useWeb3Config } from "~/lib/providers/web3";
import { log } from "~/lib/utils/log";

interface UseTokensParams {
  chainId: ChainId;
}

export const fetchTokensQueryFn = async (chainId: ChainId, config: Config) => {
  const publicClient = getPublicClient(config);

  const contract = getContract({
    address: X7ContractsEnum.TokenList,
    abi: tokenRegisteryABI,
    client: publicClient as Client,
  });

  const list = await contract.read.getRegisteredTokens();

  if (list.length > 0) {
    const fetchTokenWithTimeout = async (
      address: `0x${string}`,
      timeout: number,
    ) => {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Token fetch timeout")), timeout),
      );

      try {
        const result = await Promise.race([
          (async () => {
            const ercContract = getContract({
              address,
              abi: erc20Abi,
              client: publicClient as Client,
            });

            return {
              id: `${chainId}:${address}`,
              address,
              symbol: await ercContract.read.symbol(),
              decimals: await ercContract.read.decimals(),
              name: await ercContract.read.name(),
              status: "APPROVED" as TokenStatus,
              chainId: Number(chainId),
            };
          })(),
          timeoutPromise,
        ]);

        return result;
      } catch (error) {
        log.error(
          LogCodes.TOKEN_FETCH_ERROR,
          `Error or timeout fetching token ${address}:`,
          error,
        );

        return null;
      }
    };

    const FETCH_TIMEOUT = 5000; // 5 seconds timeout for each token

    return Promise.all(
      list.map((address) => fetchTokenWithTimeout(address, FETCH_TIMEOUT)),
    ).then(async (tokens: (SavedToken | null)[]) => {
      const validTokens = tokens.filter(
        (token): token is SavedToken => token !== null,
      );
      await saveTokens({ tokens: validTokens });

      return validTokens.reduce<Record<number, Record<string, Token>>>(
        (acc, { id, name, symbol, decimals, address }) => {
          const [_chainId, _address] = id.split(":");
          const chainId = Number(_chainId) as ChainId;

          if (!acc[chainId]) acc[chainId] = {};

          const map = acc[chainId];

          map[getAddress(address)] = new Token({
            chainId,
            name,
            decimals,
            symbol,
            address,
          });

          return acc;
        },
        {},
      );
    });
  } else {
    throw new Error("Could not fetch tokens");
  }
};

export const useTokens = ({ chainId }: UseTokensParams) => {
  const { wagmiConfig } = useWeb3Config();

  return useQuery({
    queryKey: [`tokens-${chainId}`],
    queryFn: () => fetchTokensQueryFn(chainId, wagmiConfig),
    select: (data) => data[chainId],
    placeholderData: keepPreviousData,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  });
};
