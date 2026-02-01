/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useAccount } from "wagmi";

import { cn } from "@x7/css";
import { Card, CardContent } from "@x7/ui/card";
import { CircleLoading } from "@x7/ui/circle-loading";
import { Tag } from "@x7/ui/tag";
import type { ChainId } from "@x7/utils";

import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency";
import type { LoanTermData } from "./types";

interface LoanOptionProps {
  loanTerms: Record<string, LoanTermData>;
  selectedLoan?: LoanTermData;
  setLoan: (newLoanTerm: LoanTermData) => void;
}

export function LoanOptions({
  loanTerms,
  selectedLoan,
  setLoan,
}: LoanOptionProps) {
  const { chain } = useAccount();

  const chainId = chain?.id as ChainId;

  const { symbol } = useNativeCurrency({ chainId });

  if (!Object.keys(loanTerms).length) {
    return (
      <div className="flex h-full items-center justify-center">
        <CircleLoading size={8} />
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {Object.values(loanTerms).map((loan) => {
        const isSelected = loan.address === selectedLoan?.address;

        return (
          <Card
            key={loan.address}
            className={cn(
              "cursor-pointer overflow-hidden border border-muted shadow-md transition-all duration-200",
              !isSelected && "hover:border-foreground/50",
              isSelected && "border-emerald-500 shadow-emerald-500/50",
            )}
            onClick={() => {
              if (isSelected) {
                // @ts-expect-error: ignore
                setLoan(null);
              } else {
                setLoan(loan);
              }
            }}
          >
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3
                  className={`font-heading text-lg font-semibold text-primary`}
                >
                  {loan.name}
                </h3>

                <Tag variant="large" color="zinc">
                  Up to {loan.leverage} Leverage
                </Tag>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                {loan.description}
              </p>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div>
                  <p className="font-medium text-primary">Loan Size</p>
                  <p className="text-muted-foreground">
                    <Tag
                      variant="large"
                      color={isSelected ? "emerald" : "zinc"}
                    >
                      {loan.loanSize.min.toLocaleString()}{" "}
                      {symbol.toString() ?? "Ξ"} -{" "}
                      {loan.loanSize.max.toLocaleString()}{" "}
                      {symbol.toString() ?? "Ξ"}
                    </Tag>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-primary">Duration</p>
                  <p className="text-muted-foreground">
                    <Tag
                      variant="large"
                      color={isSelected ? "emerald" : "zinc"}
                    >
                      {loan.loanLength.min} - {loan.loanLength.max} days
                    </Tag>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
