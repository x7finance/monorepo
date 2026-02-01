/* oxlint-disable @typescript-eslint/unbound-method */
import type { FC } from "react";
import React, { memo, useMemo } from "react";
import { useAccount } from "wagmi";

import type {
  ChainId,
  CurrencyAmount,
  Currency as CurrencyType,
  Fraction,
} from "@x7/utils";
import { Native } from "@x7/utils";

import { CurrencyList } from "../currency/currency-list";
import { TokenViewRow } from "./token-view-row";

interface TokenSelectorCurrencyListProps {
  id: string;
  currencies: CurrencyType[] | undefined;
  chainId: ChainId;
  officialTokenIds: string[];
  onSelect(currency: CurrencyType): void;
  pin?: {
    isPinned: (currencyId: string) => boolean;
    onPin: (currencyId: string) => void;
  };
  selected: CurrencyType | undefined;
  balancesMap: Record<string, CurrencyAmount<CurrencyType>> | undefined;
  pricesMap: Record<string, Fraction> | undefined;
  isBalanceLoading: boolean;
}

export const TokenSelectorCurrencyList: FC<TokenSelectorCurrencyListProps> =
  memo(function TokenSelectorCurrencyList({
    id,
    onSelect,
    currencies,
    selected,
    pin,
    officialTokenIds,
    pricesMap,
    balancesMap,
    isBalanceLoading,
  }) {
    const { address } = useAccount();

    const rowData = useMemo(() => {
      if (!currencies) return [];

      return currencies.map((currency) => {
        const isNative = currency.isNative;
        const currencyAddress = isNative
          ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
          : currency.address;

        return {
          id: id,
          account: address,
          currency,
          balance: balancesMap?.[currencyAddress],
          price:
            pricesMap?.[
              isNative
                ? Native.onChain(currency.chainId).wrapped.address
                : currency.address
            ],
          showWarning: isNative
            ? false
            : !officialTokenIds.includes(currency.address),
          onSelect: () => onSelect(currency),
          pin: pin
            ? {
                onPin: () => pin.onPin(currency.id),
                isPinned: pin.isPinned(currency.id),
              }
            : undefined,
          selected: selected
            ? (isNative && selected.isNative) ||
              (selected.isToken &&
                currency.isToken &&
                currency.wrapped.address === selected.wrapped.address)
            : false,
          isBalanceLoading,
        };
      });
    }, [
      currencies,
      id,
      address,
      balancesMap,
      pricesMap,
      officialTokenIds,
      onSelect,
      pin,
      selected,
      isBalanceLoading,
    ]);

    return (
      <CurrencyList
        className="scroll min-h-[256px]"
        rowHeight={64}
        rowRenderer={TokenViewRow}
        rowData={rowData}
      />
    );
  });
