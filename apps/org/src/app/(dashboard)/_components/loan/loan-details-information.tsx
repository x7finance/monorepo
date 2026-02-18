"use client"

import { cn } from "@x7/css"
import { ArrowUpRightIcon } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@x7/ui/card"
import { LinkExternal } from "@x7/ui/link"
import { Tag } from "@x7/ui/tag"
import { generateChainAbbreviation, generateChainIdByName } from "@x7/utils"
import {
  useCanLiquidate,
  useLoanBorrower,
  useLoanPair,
  useLoanToken,
} from "~/lib/hooks/loans/useXchangeLendingPoolData"
import {
  useLiquidationAmount,
  useLoanAmount,
  useLoanStartTime,
  useLoanState,
  useOriginationFeeCollected,
  useSymbol,
  useTokenByIndex,
} from "~/lib/hooks/loans/useXchangeLoanData"
import type { LoanProps } from "~/lib/types"
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink"
import { generateX7InitialLiquidityLoanTermContract } from "~/lib/utils/lending"

import { LiquidateButton } from "./liquidate-button"

export function LoanDetailsInformation(props: LoanProps) {
  const { loanId, loanType, chain } = props

  const chainId = generateChainIdByName(chain)
  const tokenByIndex = useTokenByIndex(loanId, chainId, loanType).tokenByIndex
  const symbol = useSymbol(tokenByIndex, chainId, loanType).symbol
  const loanAmount = useLoanAmount(tokenByIndex, chainId, loanType).loanAmount
  const loanStartTime = useLoanStartTime(
    tokenByIndex,
    chainId,
    loanType
  ).loanStartTime
  const liquidationAmount = useLiquidationAmount(
    tokenByIndex,
    chainId,
    loanType
  ).liquidationAmount
  const loanState = useLoanState(tokenByIndex, chainId, loanType).loanState
  const canLiquidate = useCanLiquidate(tokenByIndex, chainId).canLiquidate
  const originationFeeCollected = useOriginationFeeCollected(
    tokenByIndex,
    chainId,
    loanType
  ).originationFeeCollected

  const loanBorrower = useLoanBorrower(tokenByIndex, chainId).loanBorrower
  const loanToken = useLoanToken(tokenByIndex, chainId).loanToken
  const loanPair = useLoanPair(tokenByIndex, chainId).loanPair

  const loanDetails = [
    {
      title: "Borrower",
      value: (
        <LinkExternal
          href={`${getExplorerLink(chainId, loanBorrower, ExplorerDataType.ADDRESS)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              size: "xs",
              variant: "outline",
            }),
            "text-2xs text-muted-foreground"
          )}
        >
          {loanBorrower}
          <ArrowUpRightIcon className="ml-2 h-4 w-4" />
        </LinkExternal>
      ),
    },
    {
      title: "Token",
      value: (
        <LinkExternal
          href={`${getExplorerLink(chainId, loanToken, ExplorerDataType.ADDRESS)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              size: "xs",
              variant: "outline",
            }),
            "text-2xs text-muted-foreground"
          )}
        >
          {loanToken}
          <ArrowUpRightIcon className="ml-2 h-4 w-4" />
        </LinkExternal>
      ),
    },
    {
      title: "Pair",
      value: (
        <LinkExternal
          href={`${getExplorerLink(chainId, loanPair, ExplorerDataType.ADDRESS)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              size: "xs",
              variant: "outline",
            }),
            "text-2xs text-muted-foreground"
          )}
        >
          {loanPair}
          <ArrowUpRightIcon className="ml-2 h-4 w-4" />
        </LinkExternal>
      ),
    },
    {
      title: "Loan ID",
      value: (
        <Tag variant="large" color="zinc">
          {loanId}
        </Tag>
      ),
    },
    {
      title: "Lending Pool ID",
      value: (
        <Tag variant="large" color="zinc">
          {tokenByIndex}
        </Tag>
      ),
    },
    {
      title: "Loan Start Time",
      value: (
        <Tag variant="large" color="zinc">
          {loanStartTime}
        </Tag>
      ),
    },
    {
      title: "Loan Type",
      value: (
        <Tag variant="large" color="zinc">
          {symbol}
        </Tag>
      ),
    },
    {
      title: "Loan Amount",
      value: (
        <Tag variant="large" color="emerald">
          {loanAmount} {generateChainAbbreviation(chainId)}
        </Tag>
      ),
    },

    {
      title: "Loan State",
      value: (
        <Tag variant="large" color={loanState === 0 ? "emerald" : "zinc"}>
          {liquidationAmount === -1
            ? "Liquidated"
            : loanState === 0
              ? "Loan Active"
              : loanState === 1
                ? "Loan Paid"
                : ""}
        </Tag>
      ),
    },
    {
      title: "Can Liquidate",
      value: (
        <Tag variant="large" color={canLiquidate > 0 ? "emerald" : "zinc"}>
          {canLiquidate > 0 ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Origination Fee Collected",
      value: (
        <Tag variant="large" color="emerald">
          {originationFeeCollected} {generateChainAbbreviation(chainId)}
        </Tag>
      ),
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="border-muted border-b">
        <CardTitle>Loan Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mt-4 space-y-2">
          {loanDetails.map((detail) => (
            <li
              key={detail.title}
              className="flex items-center justify-between"
            >
              <span className="text-muted-foreground text-sm">
                {detail.title}
              </span>
              <span className="text-sm font-medium">{detail.value}</span>
              {detail.title === "Can Liquidate" && canLiquidate === 1 && (
                <LiquidateButton loanId={loanId} chainId={chainId} />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <LinkExternal
          href={`${getExplorerLink(
            chainId,
            generateX7InitialLiquidityLoanTermContract(loanType, chainId),
            ExplorerDataType.TOKEN
          )}?a=${tokenByIndex}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "w-full"
          )}
        >
          View On Chain
        </LinkExternal>
      </CardFooter>
    </Card>
  )
}
