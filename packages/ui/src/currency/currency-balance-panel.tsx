/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";
import { memo, useCallback } from "react";

import { cn } from "@x7/css";
import type {
  ActiveChainId,
  Currency,
  Currency as CurrencyType,
  Token,
} from "@x7/utils";
import { CurrencyAmount, Native } from "@x7/utils";

import { useTradePercentage } from "../hooks";

export interface CurrencyInputProps {
  id?: string;
  disabled?: boolean;
  value: string;
  onChange?(value: string): void;
  currency: CurrencyType | undefined;
  onSelect?(currency: CurrencyType): void;
  chainId: ActiveChainId;
  className?: string;
  loading?: boolean;
  usdPctChange?: number;
  disableMaxButton?: boolean;
  type: "INPUT" | "OUTPUT";
  fetching?: boolean;
  currencyLoading?: boolean;
  currencies?: Record<string, Token>;
  allowNative?: boolean;
  error?: string;
  hidePinnedTokens?: boolean;
  disableInsufficientBalanceError?: boolean;
  hideSearch?: boolean;
  forceDisable?: boolean;
  refetchCounter?: number;
  actionType?: "Buy" | "Sell";
}

type BalancePanel = Pick<
  CurrencyInputProps,
  "chainId" | "onChange" | "currency" | "disableMaxButton" | "loading"
> & {
  id?: string;
  account: string | undefined;
  balance: CurrencyAmount<Currency> | null | undefined;
  type: "INPUT" | "OUTPUT";
};

const MIN_NATIVE_CURRENCY_FOR_GAS = 10n ** 16n; // .01 ETH

const percentageButtonsText = [
  [25, "25%"],
  [50, "50%"],
  [75, "75%"],
  [100, "max"],
];

export const CurrencyBalancePanel: FC<BalancePanel> = memo(
  function BalancePanel({ id, balance, onChange, disableMaxButton, type }) {
    const [big, portion] = (balance ? `${balance.toFixed(6)}` : "0.00").split(
      ".",
    );

    const onClick = useCallback(
      (factor: any) => {
        if (onChange && balance?.greaterThan(0)) {
          if (
            balance.currency.isNative &&
            balance.greaterThan(MIN_NATIVE_CURRENCY_FOR_GAS)
          ) {
            const hundred = CurrencyAmount.fromRawAmount(
              Native.onChain(balance.currency.chainId),
              MIN_NATIVE_CURRENCY_FOR_GAS,
            );
            onChange(
              balance.subtract(hundred).divide(100).multiply(factor).toExact(),
            );
          } else {
            onChange(
              balance.greaterThan(0)
                ? balance.divide(100).multiply(factor).toExact()
                : "",
            );
          }
        }
      },
      [balance, onChange],
    );

    const [showTradePercentage] = useTradePercentage();

    const percentageButtons = percentageButtonsText.map(
      ([percentage, label]) => (
        <button
          key={`${id}-balance-button-${percentage}`}
          type="button"
          onClick={() => onClick(percentage)}
          className={cn(
            type === "INPUT" ? "text-zinc-500 dark:text-zinc-400" : "",
            "mx-0.5 flex items-center px-0.5 py-0 pt-0.5 font-medium",
          )}
          disabled={disableMaxButton}
        >
          <span className="text-2xs font-semibold text-zinc-500/70 hover:text-emerald-500">
            {label}
          </span>
        </button>
      ),
    );

    return (
      <>
        <span className="relative top-[1px] flex items-center text-xs">
          <span className="font-semibold text-zinc-500 dark:text-zinc-400">
            {big}.<span className="text-sm">{portion ?? "00"}</span>
          </span>
          <div className="flex flex-wrap">
            {!showTradePercentage ? (
              <button
                id={`${id}-balance-button`}
                type="button"
                onClick={() => onClick(100)}
                className={cn(
                  type === "INPUT" ? "" : "",
                  "flex items-end rounded-md px-0.5 font-medium text-zinc-500 dark:text-zinc-400",
                )}
                disabled={disableMaxButton}
              >
                <span className="relative top-[1px] ml-2 text-xs font-semibold text-emerald-500">
                  max
                </span>
              </button>
            ) : (
              <>{percentageButtons}</>
            )}
          </div>
        </span>
      </>
    );
  },
);
