/* eslint-disable @typescript-eslint/require-await */

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type {
  ChainId,
  Currency,
  CurrencyAmount,
  Fraction,
  Token,
} from "@x7/utils";
import { Native } from "@x7/utils";

import useDebounce from "../utils/useDebounce";
import {
  filterTokens,
  getSortedTokensByQuery,
  tokenComparator,
} from "./useSortedTokensByQuery";

interface Params {
  query: string;
  chainId?: ChainId;
  tokenMap: Record<string, Token> | undefined;
  customTokenMap: Record<string, Token> | undefined;
  pricesMap?: Record<string, Fraction>;
  balancesMap?: Record<string, CurrencyAmount<Currency>>;
  includeNative?: boolean;
}

export const useSortedTokenList = ({
  query,
  chainId,
  tokenMap,
  customTokenMap,
  balancesMap,
  pricesMap,
  includeNative,
}: Params) => {
  const debouncedQuery = useDebounce(query, 250);

  return useQuery({
    queryKey: [
      "sortedTokenList",
      {
        debouncedQuery,
        tokenMap,
        customTokenMap,
        balancesMap,
        pricesMap,
        includeNative,
      },
    ],
    queryFn: async () => {
      const tokenMapValues = tokenMap ? Object.values(tokenMap) : [];
      const uniqTokenMapIds: string[] = [];
      const tokenMapValuesUniq = tokenMapValues.filter((el) => {
        if (uniqTokenMapIds.includes(el.address)) return false;
        uniqTokenMapIds.push(el.address);
        return true;
      });

      const customTokenMapValues = customTokenMap
        ? Object.values(customTokenMap).filter(
            (el) =>
              el.chainId === chainId && !uniqTokenMapIds.includes(el.address),
          )
        : [];

      const _includeNative =
        includeNative &&
        chainId &&
        (!debouncedQuery ||
          debouncedQuery
            .toLowerCase()
            .includes(Native.onChain(chainId).symbol.toLowerCase()));

      const filteredTokens: Token[] = filterTokens(
        tokenMapValuesUniq,
        debouncedQuery,
      );
      const filteredCustomTokens: Token[] = filterTokens(
        customTokenMapValues,
        debouncedQuery,
      );
      const sortedTokens: Token[] = [
        ...filteredTokens,
        ...filteredCustomTokens,
      ].sort(tokenComparator(balancesMap, pricesMap));

      const filteredSortedTokens = getSortedTokensByQuery(
        sortedTokens,
        debouncedQuery,
      );
      if (_includeNative) {
        return [Native.onChain(chainId), ...filteredSortedTokens];
      }

      return filteredSortedTokens;
    },
    placeholderData: keepPreviousData,
  });
};
