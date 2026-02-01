/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Config } from "@wagmi/core";
import { getBalance, readContracts } from "@wagmi/core";
import type { Address } from "viem";
import { erc20Abi, isAddress, zeroAddress } from "viem";

import type { ActiveChainId, Currency, Token } from "@x7/utils";
import { CurrencyAmount, Native } from "@x7/utils";

import { useWeb3Config } from "~/lib/providers/web3";
import { CACHE_TIERS, TIME } from "~/lib/query";

interface UseBalanceParams {
  chainId: ActiveChainId | undefined;
  currencies: (Currency | undefined)[];
  account: Address | undefined;
  enabled?: boolean;
  config: Config;
}

export const queryFnUseBalances = async ({
  chainId,
  currencies,
  account,
  config,
}: Omit<UseBalanceParams, "enabled">) => {
  if (!account || !chainId || !currencies) return null;
  const native = await getBalance(config, {
    address: account,
    chainId: chainId,
    unit: "wei",
  });

  const [validatedTokens, validatedTokenAddresses] = currencies.reduce<
    [Token[], Address[]]
  >(
    (acc, currencies) => {
      if (chainId && currencies && isAddress(currencies.wrapped.address)) {
        acc[0].push(currencies.wrapped);
        acc[1].push(currencies.wrapped.address);
      }

      return acc;
    },
    [[], []],
  );

  const data = await readContracts(config, {
    contracts: validatedTokenAddresses.map(
      (token) =>
        ({
          chainId: chainId,
          address: token,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [account],
        }) as const,
    ),
  });

  const _data = data.reduce<Record<string, CurrencyAmount<Currency>>>(
    (acc, _cur, i) => {
      const amount = data[i]?.result;
      if (typeof amount === "bigint") {
        acc[validatedTokens[i]?.address ?? ""] = CurrencyAmount.fromRawAmount(
          // @ts-expect-error: todo fix
          validatedTokens[i],
          amount,
        );
      }
      return acc;
    },
    {},
  );

  _data[zeroAddress] = CurrencyAmount.fromRawAmount(
    Native.onChain(chainId),
    native.value,
  );

  return _data;
};

export const useBalancesWeb3 = ({
  chainId,
  currencies,
  account,
  enabled = true,
}: Omit<UseBalanceParams, "config">) => {
  const { wagmiConfig } = useWeb3Config();
  useEffect(() => {
    if (currencies && currencies.length > 100) {
      throw new Error(
        "useBalancesWeb3: currencies length > 100, this will hurt performance and cause rate limits",
      );
    }
  }, [currencies]);

  return useQuery({
    queryKey: ["useBalancesWeb3", { chainId, currencies, account }],
    queryFn: () =>
      queryFnUseBalances({ chainId, currencies, account, config: wagmiConfig }),
    refetchInterval: TIME.MINUTE,
    enabled: Boolean(chainId && account && enabled && currencies),
    ...CACHE_TIERS.DYNAMIC,
  });
};
