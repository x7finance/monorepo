import type { LoanProps } from "~/lib/types";
import { LoanDetailsInformation } from "./loan-details-information";
import { LoanRepaymentInformation } from "./loan-repayment-information";

export function LoanDetails(props: LoanProps) {
  const { loanId, loanType, chain } = props;

  return (
    <div className="mb-5 mt-5 grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <LoanDetailsInformation
        loanId={loanId}
        loanType={loanType}
        chain={chain}
      />
      <LoanRepaymentInformation
        loanId={loanId}
        loanType={loanType}
        chain={chain}
      />
    </div>
  );
}
