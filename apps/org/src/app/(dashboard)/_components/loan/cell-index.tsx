/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { cn } from "@x7/css";
import { ChevronRightIcon } from "@x7/icons";
import { buttonVariants } from "@x7/ui/button";
import { LinkInternal } from "@x7/ui/link";
import type { ChainId, LoanType } from "@x7/utils";
import { generateChainShortName } from "@x7/utils";

import {
  useCanLiquidate,
  useLoanToken,
} from "~/lib/hooks/loans/useXchangeLendingPoolData";
import {
  useGetPremiumPaymentSchedule,
  useGetPrincipalPaymentSchedule,
  useGetTotalDue,
  useIsComplete,
  useLiquidationAmount,
  useLoanState,
  useSymbol,
  useTokenByIndex,
  useTokenSymbol,
} from "~/lib/hooks/loans/useXchangeLoanData";
import { IconAlerts } from "./icon-alerts";

interface LoansCellProps {
  id: number;
  chainId: ChainId;
  loanType: LoanType;
}

export function LoanCellIndex({ id, chainId, loanType }: LoansCellProps) {
  const tokenByIndex = useTokenByIndex(id, chainId, loanType).tokenByIndex;
  const symbol = useSymbol(tokenByIndex, chainId, loanType).symbol;
  const loanState = useLoanState(tokenByIndex, chainId, loanType).loanState;
  const loanAddress = useLoanToken(tokenByIndex, chainId).loanToken;
  const tokenSymbol = useTokenSymbol(loanAddress, chainId).tokenSymbol;
  const canLiquidate = useCanLiquidate(tokenByIndex, chainId).canLiquidate;
  const liquidationAmount = useLiquidationAmount(
    tokenByIndex,
    chainId,
    loanType,
  ).liquidationAmount;
  const isComplete = useIsComplete(tokenByIndex, chainId, loanType).isComplete;

  const premiumPaymentSchedule = useGetPremiumPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType,
  ).getPremiumPaymentSchedule;

  const principalPaymentSchedule = useGetPrincipalPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType,
  ).getPrincipalPaymentSchedule;

  const totalDue = useGetTotalDue(
    tokenByIndex,
    chainId,
    loanType,
    premiumPaymentSchedule?.[premiumPaymentSchedule?.[0]?.length - 1],
    principalPaymentSchedule?.[principalPaymentSchedule?.[0]?.length - 1],
  ).getTotalDue;

  return (
    <>
      <div className="w-full font-medium text-zinc-900 dark:text-zinc-100">
        <div className="flex items-center">
          <div className="flex items-center">
            <>
              <span
                className={`font-medium ${
                  loanState === 1
                    ? "text-emerald-500 dark:text-emerald-500"
                    : "text-red-500 dark:text-red-500"
                } dark:text-zinc-100`}
              >
                {tokenByIndex ? `${tokenByIndex}` : ". . ."}
              </span>
              <div className="relative ml-2 inline-block lg:hidden">
                <div className="flex items-center space-x-2">
                  <div className="flex shrink-0 space-x-1">
                    ${tokenSymbol} - [{symbol}]
                  </div>
                </div>
              </div>
            </>
            <div className="ml-2 lg:hidden">
              <IconAlerts
                liquidationAmount={liquidationAmount}
                canLiquidate={canLiquidate}
                loanState={loanState}
                loanId={id}
                chainId={chainId}
              />
            </div>
          </div>
          <div className="ml-auto inline-block lg:hidden">
            {tokenByIndex ? (
              <LinkInternal
                prefetch={true}
                href={`/lending/${generateChainShortName(
                  chainId,
                )}/${loanType}/${id}`}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                  }),
                  "inline-flex",
                )}
              >
                <span className="flex items-center whitespace-nowrap">
                  <span>View</span>
                  <span>
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </span>
                </span>
              </LinkInternal>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
        <div className="mt-1 flex flex-col text-sm text-zinc-500 sm:block lg:hidden dark:text-zinc-400">
          <span className="flex items-center opacity-70 dark:opacity-50">
            Status : {isComplete ? "Completed" : "Active"}
          </span>
          <span className="flex items-center opacity-70 dark:opacity-50">
            Total Due : {totalDue}
          </span>
        </div>
      </div>
    </>
  );
}
