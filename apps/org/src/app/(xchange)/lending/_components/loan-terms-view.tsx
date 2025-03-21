/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";

import { X7LendingPoolV2 } from "@x7/contracts";
import { X7ContractsEnum } from "@x7/sdk";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@x7/ui/table";
import type { ChainId } from "@x7/utils";
import { generateChainName, LOAN_NAME_MAPPING } from "@x7/utils";

import { useLoanTermData } from "../_hooks/useLoanTermData";
import { LoanTermRow } from "./loan-term-row";

interface StatusTableProps {
  chainId: ChainId;
}

interface LoanTermData {
  result: string;
}

export function LoanTermsView({ chainId }: StatusTableProps) {
  const [loanAddresses, setLoanAddresses] = useState<`0x${string}`[]>([]);
  const lendingPoolContractAddress = X7ContractsEnum.X7_LendingPool(chainId);

  const { data: ReadContractData } = useReadContracts({
    contracts: [
      {
        address: lendingPoolContractAddress,
        abi: X7LendingPoolV2,
        functionName: "countOfActiveLoanTerms",
        chainId,
      },
    ],
  });

  const activeLoanTermsCount = ReadContractData?.[0]?.result
    ? Number(ReadContractData[0].result)
    : 0;

  const loanContracts = Array.from(
    { length: activeLoanTermsCount },
    (_, i) => ({
      address: lendingPoolContractAddress,
      abi: X7LendingPoolV2,
      functionName: "activeLoanTerms",
      args: [i],
      chainId,
    }),
  );

  const { data: loanTermsData } = useReadContracts({
    contracts: loanContracts,
  }) as { data: LoanTermData[] };

  useEffect(() => {
    if (loanTermsData) {
      const addresses = loanTermsData.map(
        (item: LoanTermData) => item.result as `0x${string}`,
      );
      setLoanAddresses(addresses);
    }
  }, [loanTermsData]);

  const { loanTermData } = useLoanTermData(chainId, loanAddresses);

  const popularLoanOrder = ["Sagittarius", "Cygnus", "Messier", "Centaurus"];

  const updatedLoanTermData = loanTermData.map((loan) => ({
    ...loan,

    loanName: LOAN_NAME_MAPPING[loan.loanName] || loan.loanName,
  }));

  const mostPopular =
    popularLoanOrder.find((newName) =>
      updatedLoanTermData.some((loan) => loan.loanName === newName),
    ) || null;

  const filteredLoans = updatedLoanTermData.filter((loan) => loan.loanName);

  return (
    <>
      <div className="container mx-auto mb-96 mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-bold text-primary">
            {generateChainName(chainId)} Active Loan Terms
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            X7 Finance offers various loan terms to suit your needs. Below is
            detailed information on the different terms. Hover over the details
            to learn more about each section. The X7DAO has the power to
            add/remove terms.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan Name</TableHead>
              <TableHead>Loan Length Range</TableHead>
              <TableHead>Loan Amount Range</TableHead>
              <TableHead>Origination Fee</TableHead>
              <TableHead>Liquidation Fee</TableHead>
              <TableHead>Repayment Periods</TableHead>
              <TableHead className="flex items-center justify-end pr-4">
                Loan Cost
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans
              .filter((loan) => loan.loanName)
              .map((loan, index) => (
                <LoanTermRow
                  key={index}
                  loan={loan}
                  chainId={chainId}
                  isPopular={loan.loanName === mostPopular}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
