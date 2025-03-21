"use client";

import { useMemo } from "react";

import type { Amount, ChainId, Currency } from "@x7/utils";
import { Native } from "@x7/utils";

import { usePrice } from "../prices/usePrice";

interface Params {
  chainId: ChainId;
  amounts: (Amount<Currency | Native> | undefined)[] | null | undefined;
}

type UseTokenAmountDollarValues = (params: Params) => {
  loading: boolean;
  values: number[];
};

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({
  chainId,
  amounts,
}) => {
  const { data: nativePrice, isLoading: isNativeLoading } = usePrice({
    chainId,
    currency: Native.onChain(chainId),
  });

  const { data: price0, isLoading: isPrice0Loading } = usePrice({
    chainId: chainId,
    currency: amounts?.[0]?.currency ?? Native.onChain(chainId),
  });

  const { data: price1, isLoading: isPrice1Loading } = usePrice({
    chainId: chainId,
    currency: amounts?.[1]?.currency ?? Native.onChain(chainId),
  });

  return useMemo(() => {
    if (!price0 || !price1 || !nativePrice) {
      return {
        loading: isNativeLoading || isPrice0Loading || isPrice1Loading,
        values: [],
      };
    }
    if (!amounts) {
      return {
        loading: isPrice1Loading,
        values: [],
      };
    }

    return {
      loading: isPrice1Loading,
      values: amounts.map((amount, index) => {
        if (!amount) return -1;
        const price = index === 0 ? price0 : price1;
        const usdOffOfNativePer = amount.currency.isNative
          ? parseFloat(nativePrice.toExact())
          : parseFloat(nativePrice.toExact()) * parseFloat(price.toExact());

        const display = usdOffOfNativePer * parseFloat(amount.toExact());

        return display;
      }),
    };
  }, [
    amounts,
    price0,
    price1,
    nativePrice,
    isNativeLoading,
    isPrice0Loading,
    isPrice1Loading,
  ]);
};
