/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { useChainId } from "wagmi";

import { cn } from "@x7/css";
import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card";
import { Input } from "@x7/ui/input";
import { Tag } from "@x7/ui/tag";
import { generateChainAbbreviation, generateChainIdByName } from "@x7/utils";

import {
  useGetPremiumPaymentSchedule,
  useGetPremiumsDue,
  useGetPrincipalDue,
  useGetPrincipalPaymentSchedule,
  useGetRemainingLiability,
  useGetTotalDue,
  useLiquidationAmount,
  useLoanState,
  useNumberOfPremiumPeriods,
  useNumberOfRepaymentPeriods,
  usePremiumAmount,
  usePremiumAmountPaid,
  useTokenByIndex,
} from "~/lib/hooks/loans/useXchangeLoanData";
import type { LoanProps } from "~/lib/types";
import { CountdownTimer } from "./countdown-timer";
import { PaymentButton } from "./payment-button";
import { PaymentScheduleElements } from "./payment-schedule-elements";

export function LoanRepaymentInformation(props: LoanProps) {
  const { loanId, loanType, chain } = props;

  const chainId = generateChainIdByName(chain);
  const currentChainId = useChainId();
  const isCorrectNetwork = currentChainId === chainId;
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  const tokenByIndex = useTokenByIndex(loanId, chainId, loanType).tokenByIndex;
  const getPremiumPaymentSchedule = useGetPremiumPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType,
  ).getPremiumPaymentSchedule;
  const getPrincipalPaymentSchedule = useGetPrincipalPaymentSchedule(
    tokenByIndex,
    chainId,
    loanType,
  ).getPrincipalPaymentSchedule;
  const numberOfPremiumPeriods = useNumberOfPremiumPeriods(
    chainId,
    loanType,
  ).numberOfPremiumPeriods;
  const numberOfRepaymentPeriods = useNumberOfRepaymentPeriods(
    chainId,
    loanType,
  ).numberOfRepaymentPeriods;
  const loanState = useLoanState(tokenByIndex, chainId, loanType).loanState;
  const liquidationAmount = useLiquidationAmount(
    tokenByIndex,
    chainId,
    loanType,
  ).liquidationAmount;
  const premiumAmountPaid = usePremiumAmountPaid(
    tokenByIndex,
    chainId,
    loanType,
  ).premiumAmountPaid;
  const premiumAmount = usePremiumAmount(
    tokenByIndex,
    chainId,
    loanType,
  ).premiumAmount;
  const getPremiumsDue = useGetPremiumsDue(
    tokenByIndex,
    chainId,
    loanType,
    getPremiumPaymentSchedule?.[0]?.[
      getPremiumPaymentSchedule?.[0]?.length - 1
    ],
  ).getPremiumsDue;
  const getPrincipalDue = useGetPrincipalDue(
    tokenByIndex,
    chainId,
    loanType,
    getPrincipalPaymentSchedule?.[0]?.[
      getPrincipalPaymentSchedule?.[0]?.length - 1
    ],
  ).getPrincipalDue;
  const totalDue = useGetTotalDue(
    tokenByIndex,
    chainId,
    loanType,
    getPremiumPaymentSchedule?.[0]?.[
      getPremiumPaymentSchedule?.[0]?.length - 1
    ],
    getPrincipalPaymentSchedule?.[0]?.[
      getPrincipalPaymentSchedule?.[0]?.length - 1
    ],
  ).getTotalDue;
  const getRemainingLiability = useGetRemainingLiability(
    tokenByIndex,
    chainId,
    loanType,
  ).getRemainingLiability;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!isNaN(Number(value)) && Number(value) <= totalDue) {
      setPaymentAmount(value);
    }
  };

  const loanDetails = [
    {
      title: "Premium Paid",
      value: (
        <Tag variant="large" color="zinc">
          {`${premiumAmountPaid.toFixed(4)} of ${premiumAmount} ${generateChainAbbreviation(chainId)}`}
        </Tag>
      ),
    },
    {
      title: "Premium Due",
      value: (
        <Tag variant="large" color="emerald">
          {`${getPremiumsDue.toFixed(4)} ${generateChainAbbreviation(chainId)}`}
        </Tag>
      ),
      action: premiumAmount > 0 && (
        <PaymentButton
          amount={getPremiumsDue?.toString() ?? "0"}
          buttonText="Pay"
          loanId={tokenByIndex}
          chainId={chainId}
          disabled={!isCorrectNetwork}
        />
      ),
    },
    {
      title: "Principal Due",
      value: (
        <Tag variant="large" color="emerald">
          {`${getPrincipalDue.toFixed(4)} ${generateChainAbbreviation(chainId)}`}
        </Tag>
      ),
    },
    {
      title: "Remaining Liability",
      value: (
        <Tag variant="large" color="emerald">
          {`${getRemainingLiability.toFixed(4)} ${generateChainAbbreviation(chainId)}`}
        </Tag>
      ),
    },

    {
      title: "Principal Payment Schedule",
      value: getPrincipalPaymentSchedule,
      isSchedule: true,
    },
    {
      title: "Premium Payment Schedule",
      value: getPremiumPaymentSchedule,
      isSchedule: true,
    },
    {
      title: "Total Due",
      value: (
        <Tag variant="large" color="emerald">
          {`${totalDue.toFixed(4)} ${generateChainAbbreviation(chainId)}`}
        </Tag>
      ),
      action: totalDue > 0 && (
        <PaymentButton
          amount={totalDue?.toString() ?? "0"}
          buttonText="Pay All Due"
          loanId={tokenByIndex}
          chainId={chainId}
          disabled={!isCorrectNetwork}
        />
      ),
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader className="border-b border-muted">
        <CardTitle>Repayment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className={cn("mt-4 space-y-2")}>
          {loanDetails.map((detail) => (
            <li key={detail.title}>
              {detail.isSchedule ? (
                <>
                  <h4 className="mt-4 text-2xs font-bold uppercase text-muted-foreground">
                    {detail.title}
                  </h4>
                  <div className="mt-1 space-y-1">
                    {detail.value?.map(
                      (innerArray: number[], outerIndex: number) =>
                        innerArray
                          .filter(() => outerIndex === 0)
                          .map((element: number, innerIndex: number) => (
                            <div
                              key={`${outerIndex}-${innerIndex}`}
                              className="flex justify-between text-muted-foreground"
                            >
                              <Tag variant="large" color="zinc">
                                {new Date(
                                  parseInt(element.toString() ?? "0", 10) *
                                    1000,
                                ).toLocaleString()}
                              </Tag>
                              <span>
                                <Tag variant="large" color="emerald">
                                  {(
                                    parseInt(
                                      detail.value[outerIndex + 1][
                                        innerIndex
                                      ].toString() ?? "0",
                                      10,
                                    ) /
                                    10 ** 18
                                  ).toFixed(4)}{" "}
                                  {generateChainAbbreviation(chainId)}
                                </Tag>
                              </span>
                            </div>
                          )),
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-muted-foreground">
                    {detail.title}
                  </span>
                  <div className="flex flex-col items-end space-y-1">
                    <>{detail.value}</>
                    {detail.action && <span className="">{detail.action}</span>}
                  </div>
                </div>
              )}
            </li>
          ))}
          <li>
            <h4 className="mt-4 text-2xs font-bold uppercase text-muted-foreground">
              Total Repayment Schedule
            </h4>
            <div className="mt-1 space-y-1 text-muted-foreground">
              <PaymentScheduleElements
                getPrincipalPaymentSchedule={
                  getPrincipalPaymentSchedule as number[][]
                }
                getPremiumPaymentSchedule={
                  getPremiumPaymentSchedule as number[][]
                }
                numberOfPremiumPeriods={numberOfPremiumPeriods}
                numberOfRepaymentPeriods={numberOfRepaymentPeriods}
                loanId={tokenByIndex}
                chainId={chainId}
              />
            </div>
          </li>
        </ul>

        {totalDue > 0 && (
          <div className="mt-4 flex items-center space-x-2">
            <Input
              type="number"
              value={paymentAmount}
              onChange={handleInputChange}
              placeholder="Enter amount to pay"
              max={totalDue}
            />
            <PaymentButton
              amount={paymentAmount.toString()}
              buttonText="Pay Amount"
              loanId={tokenByIndex}
              chainId={chainId}
              disabled={!isCorrectNetwork}
            />
          </div>
        )}
        {(numberOfPremiumPeriods > 0 || numberOfRepaymentPeriods > 0) && (
          <div className="mt-6">
            <h4 className="mt-4 text-2xs font-bold uppercase text-muted-foreground">
              Next Payment Due
            </h4>

            <CountdownTimer
              getPrincipalPaymentSchedule={getPrincipalPaymentSchedule}
              getPremiumPaymentSchedule={getPremiumPaymentSchedule}
              numberOfPremiumPeriods={numberOfPremiumPeriods}
              numberOfRepaymentPeriods={numberOfRepaymentPeriods}
              loanState={loanState}
              liquidationAmount={liquidationAmount}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
