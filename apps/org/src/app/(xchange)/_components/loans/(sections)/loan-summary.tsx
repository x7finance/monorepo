/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// /* eslint-disable @typescript-eslint/no-unnecessary-condition */

import React from "react";
import { formatEther } from "viem";
import { useChainId } from "wagmi";

import { cn } from "@x7/css";
import { InfoIcon } from "@x7/icons";
import { Card, CardContent } from "@x7/ui/card";
import { CircleLoading } from "@x7/ui/circle-loading";
import { Tag } from "@x7/ui/tag";
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip";
import type { ChainId } from "@x7/utils";
import { Native } from "@x7/utils";

import { useLiquidationReward } from "~/lib/hooks/loans/useXchangeLendingPoolData";
import type { QuoteResponse, RawQuoteResponse } from "~/lib/providers/loan";
import { LoanTypeRepaymentSummary } from "./loan-type-repayment-summary";

interface LoanSummaryProps {
  selectedQuote?: QuoteResponse;
  loanDuration: number;
  quotes: RawQuoteResponse[];
}

export function LoanSummary({ selectedQuote, loanDuration }: LoanSummaryProps) {
  const chainId = useChainId() as ChainId;
  const { liquidationReward } = useLiquidationReward(chainId);
  const nativeCurrency = Native.onChain(chainId);

  if (!selectedQuote) {
    return (
      <div className="flex h-full items-center justify-center">
        <CircleLoading size={8} />
      </div>
    );
  }

  const liquidationFee = formatEther(liquidationReward ?? 0n).toString();
  const totalCostRaw =
    (selectedQuote.result[3] ?? 0n) + (selectedQuote.result[4] ?? 0n);
  const totalSavings = formatEther(
    (selectedQuote.result[2] ?? 0n) +
      (selectedQuote.result[1] ?? 0n) -
      totalCostRaw,
  ).toString();
  const totalCostToLaunch = formatEther(
    BigInt(selectedQuote.result[1] ?? 0n) + liquidationReward,
  ).toString();
  const discountedTotalPremium = formatEther(
    BigInt(selectedQuote.result[4] ?? 0n),
  ).toString();

  const originationFee = formatEther(
    BigInt(selectedQuote.result[1] ?? 0n),
  ).toString();

  // const totalPremium = formatEther(
  //   BigInt(selectedQuote.result[2] ?? 0n),
  // ).toString();

  // const premiumFeeModifier =
  //   parseFloat(
  //     (BigInt(10000) - BigInt(selectedQuote.result[5] ?? 0n)).toString(),
  //   ) / 100;

  // const originationFeeModifier =
  //   parseFloat(
  //     (BigInt(10000) - BigInt(selectedQuote.result[6] ?? 0n)).toString(),
  //   ) / 100;

  // const discountTotal = formatEther(
  //   totalCostRaw + liquidationReward,
  // ).toString();

  // const discountedOriginationFee = formatEther(
  //   BigInt(selectedQuote.result[3] ?? 0n),
  // ).toString();

  return (
    <Card className={cn("overflow-hidden border border-muted shadow-md")}>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-heading text-lg font-semibold text-primary">
            Loan Cost Breakdown
          </h3>
          <Tag variant="large" color="zinc">
            Cost to Launch: {totalCostToLaunch}{" "}
            {nativeCurrency.symbol.toString() ?? "ETH"}
          </Tag>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-primary">Origination Fee</p>
            <p className="text-muted-foreground">
              <Tag variant="large" color="emerald">
                {originationFee} {nativeCurrency.symbol.toString() ?? "ETH"}
              </Tag>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-primary">
              Liquidation Deposit{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="relative bottom-1 inline h-3.5 w-3.5 text-zinc-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Liquidation deposit returned on completed loan repayment
                  </p>
                </TooltipContent>
              </Tooltip>
            </p>
            <p className="text-muted-foreground">
              <Tag variant="large" color="emerald">
                {liquidationFee} {nativeCurrency.symbol.toString() ?? "ETH"}
              </Tag>
            </p>
          </div>
        </div>
        {parseFloat(discountedTotalPremium) > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-primary">Premium Total</p>
            <p className="text-muted-foreground">
              <Tag variant="large" color="emerald">
                {discountedTotalPremium}{" "}
                {nativeCurrency.symbol.toString() ?? "ETH"}
              </Tag>
            </p>
          </div>
        )}
        <div className="mt-4">
          <p className="text-sm font-medium text-primary">Total Savings</p>
          <p className="text-muted-foreground">
            <Tag variant="large" color="emerald">
              {totalSavings} {nativeCurrency.symbol.toString() ?? "ETH"}
            </Tag>
          </p>
        </div>
        <div className="flex w-full flex-col">
          <LoanTypeRepaymentSummary
            quote={selectedQuote}
            loanDuration={loanDuration}
          />
        </div>
        {/* TODO: Re-enable
        <div>
                   <span className="text-xs italic text-zinc-400">
                     {Boolean(
                       originationFeeModifier > 0 || premiumFeeModifier > 0,
                     ) &&
                       `Your loan term conditions is entitled for a discount:`}
                   </span>
                 </div>
                 <div className="grid w-full grid-cols-3 gap-1 text-xs sm:text-sm">
                   <span>Discounted Total</span>
                   <div>
                     <span className="mr-2 line-through">
                       {Number(totalCostToLaunch) + Number(totalPremium)}
                     </span>
                     <span className="text-base font-bold sm:text-lg">
                       {discountTotal}
                     </span>
                   </div>
                   <span className="text-base font-bold text-blue-500 sm:text-lg">
                     {totalSavings.toString()}{" "}
                     {nativeCurrency.symbol.toString() ?? "ETH"}
                   </span>
                 </div> */}
      </CardContent>
    </Card>
  );
}
