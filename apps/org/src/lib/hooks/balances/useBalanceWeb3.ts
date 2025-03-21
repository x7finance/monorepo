import { useQuery } from "@tanstack/react-query";
import { zeroAddress } from "viem";
import type { Address } from "viem";

import type { ActiveChainId, Currency } from "@x7/utils";

import { useWeb3Config } from "~/lib/providers/web3";
import { queryFnUseBalances } from "./useBalancesWeb3";

interface UseBalanceParams {
  chainId: ActiveChainId | undefined;
  currency: Currency | undefined;
  account: Address | undefined;
  enabled?: boolean;
}

export const useBalanceWeb3 = ({
  chainId,
  currency,
  account,
  enabled = true,
}: UseBalanceParams) => {
  const { wagmiConfig } = useWeb3Config();

  return useQuery({
    queryKey: ["useBalance", { chainId, currency, account }],
    queryFn: async () => {
      if (!currency) return null;
      const data = await queryFnUseBalances({
        chainId,
        currencies: [currency],
        account,
        config: wagmiConfig,
      });
      return (
        data?.[currency.isNative ? zeroAddress : currency.wrapped.address] ??
        null
      );
    },
    refetchInterval: 60000,
    enabled: Boolean(chainId && account && enabled),
  });
};
