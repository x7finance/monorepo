/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";
import { useMemo } from "react";

import { cn } from "@x7/css";
import type { CurrencyAmount } from "@x7/utils";
import { tryParseAmount } from "@x7/utils";

import { SkeletonText } from "../skeleton";
import type { CurrencyInputProps } from "./currency-balance-panel";

type PricePanel = Pick<
  CurrencyInputProps,
  "loading" | "currency" | "value" | "usdPctChange"
> & {
  error?: string;
  price: CurrencyAmount<any> | undefined;
  nativePrice: CurrencyAmount<any> | undefined;
};

export const PricePanel: FC<PricePanel> = ({
  loading,
  price: _price,
  nativePrice,
  currency,
  value,
  usdPctChange,
  error,
}) => {
  const parsedValue = useMemo(
    () => tryParseAmount(value, currency),
    [currency, value],
  );

  if (loading) {
    return (
      <div className="flex items-center">
        <SkeletonText fontSize="lg" className="w-full" />
      </div>
    );
  }

  if (!_price || !nativePrice) {
    return <div className="flex-1" />;
  }

  const usdOffOfNativePer = currency?.isNative
    ? parseFloat(nativePrice.toExact())
    : parseFloat(nativePrice.toExact()) * parseFloat(_price.toExact());

  const display = usdOffOfNativePer * parseFloat(value);

  const [big, portion] = (
    parsedValue ? `${display.toPrecision(6)}` : "0.00"
  ).split(".");

  if (error) {
    return (
      <p className="text-red select-none py-1 text-sm font-medium">{error}</p>
    );
  }

  return (
    <p className="flex select-none items-baseline font-medium text-zinc-500 dark:text-zinc-400">
      <>
        <span className={"text-xs"}>~$</span>
        {big}.<span className="text-sm font-semibold">{portion}</span>
      </>

      {!!loading && usdPctChange && usdPctChange !== 0 && (
        <span
          className={cn(
            "pl-1 text-sm",
            usdPctChange > 0
              ? "text-green"
              : usdPctChange < -5
                ? "text-red"
                : usdPctChange < -3
                  ? "text-yellow"
                  : "text-zinc-500",
          )}
        >
          {" "}
          {`${
            usdPctChange.toFixed(2) === "0.00"
              ? ""
              : usdPctChange > 0
                ? "(+"
                : "("
          }${
            usdPctChange.toFixed(2) === "0.00"
              ? ""
              : `${usdPctChange.toFixed(2)}%)`
          }`}
        </span>
      )}
    </p>
  );
};
