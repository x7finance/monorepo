/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Native } from "@x7/utils";
import type { ChainId, LoanType } from "@x7/utils";

import {
  usePremiumFractions,
  useRepaymentFractions,
} from "~/lib/hooks/loans/useXchangeLoanData";

interface LoanTypeRepaymentFractionProps {
  key: string;
  period: number;
  loanDuration: number;
  chainId: ChainId;
  loanTermNumber: LoanType;
  totalIndices: number;
  principalFractionDenominator: number;
  loanAmount: string;
}

export function LoanTypeRepaymentFraction({
  period,
  loanDuration,
  chainId,
  loanTermNumber,
  totalIndices,
  principalFractionDenominator,
  loanAmount,
}: LoanTypeRepaymentFractionProps) {
  const nativeCurrency = Native.onChain(chainId);
  const { repaymentFractions } = useRepaymentFractions(
    period,
    chainId,
    loanTermNumber,
  );
  const { premiumFractions } = usePremiumFractions(
    period,
    chainId,
    loanTermNumber,
  );

  if (repaymentFractions === 0 && premiumFractions === 0) {
    return null;
  }

  const repaymentAmount =
    (repaymentFractions / principalFractionDenominator) * Number(loanAmount);
  const premiumAmount =
    Number(loanAmount) * (1 + premiumFractions / principalFractionDenominator) -
    Number(loanAmount);

  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="ring-indigo/30 rounded-full bg-emerald-600/10 px-2 py-1 text-[13px] font-medium text-black ring-1 ring-inset dark:text-white">
        Payment
      </span>
      <div className="flex items-center gap-x-1">
        <span className="font-semibold">
          {repaymentAmount + premiumAmount}{" "}
          {nativeCurrency.symbol.toString() ?? "ETH"}
        </span>

        <div className="text-xs text-zinc-500">due by</div>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">
          {formatDateTime(loanDuration, period, totalIndices)}{" "}
          <span className="text-xs font-bold uppercase text-zinc-300 dark:text-zinc-500">
            UTC
          </span>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(
  loanDuration: number,
  period: number,
  totalperiod: number,
) {
  const currentDate = new Date();
  const adjustedLoanDuration = (loanDuration / totalperiod) * period;

  const futureDate = new Date(currentDate);
  const milliseconds = adjustedLoanDuration * 24 * 60 * 60 * 1000;

  futureDate.setTime(currentDate.getTime() + milliseconds);

  const formatDateTime = (dateTime: Date) => {
    const day = dateTime.getUTCDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[dateTime.getUTCMonth()];
    const year = dateTime.getUTCFullYear().toString();
    const hours = dateTime.getUTCHours().toString().padStart(2, "0");
    const minutes = dateTime.getUTCMinutes().toString().padStart(2, "0");

    return `${month} ${day} ${year} ${hours}:${minutes}`;
  };

  return formatDateTime(futureDate);
}
