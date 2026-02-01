/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-member-access */

import type { ChainId } from "@x7/utils"

import { ArrowUpRightSquareIcon, CircleAlertIcon, X7Logo } from "@x7/icons"
import { LinkExternal } from "@x7/ui/link"
import { TableCell, TableRow } from "@x7/ui/table"
import { Tag } from "@x7/ui/tag"
import { Tooltip, TooltipContent, TooltipTrigger } from "@x7/ui/tooltip"
import { generateChainDenomination, LogCodes } from "@x7/utils"
import { SECONDS_IN_A_DAY } from "~/lib/constants/misc"
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink"
import { log } from "~/lib/utils/log"

interface LoanTermRowProps {
  loan: any
  chainId: ChainId
  isPopular: boolean
}

export function LoanTermRow({ loan, chainId, isPopular }: LoanTermRowProps) {
  const _totalLoanCost = calculateTotalLoanCost(loan)
  const paymentDue = loan.premiumAndPrincipalDueAtEnd
    ? "throughout loan"
    : "end of loan"

  log.info(LogCodes.LOAN_INFO, `Implement total cost of loan: `, _totalLoanCost)

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <LinkExternal
            href={`${getExplorerLink(chainId, loan.address as string, ExplorerDataType.ADDRESS)}#code`}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-primary flex items-center font-semibold hover:underline"
          >
            {loan.loanName} <br />({loan.loanSymbol})
            <ArrowUpRightSquareIcon className="w- ml-1 h-4 opacity-50 group-hover:opacity-100" />
          </LinkExternal>

          {isPopular && (
            <span className="flex w-full items-center whitespace-nowrap">
              <Tag variant="large" color="emerald">
                <span className="flex items-center">
                  <X7Logo className="mr-1 h-4 w-4 fill-emerald-500 opacity-70" />
                  Most Popular
                </span>
              </Tag>
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Tag variant="large" color="zinc">
          {Math.ceil(loan.minimumLoanLengthSeconds / SECONDS_IN_A_DAY)} -{" "}
          {loan.maximumLoanLengthSeconds / SECONDS_IN_A_DAY} {"Days"}
        </Tag>
      </TableCell>
      <TableCell>
        <Tag variant="large" color="zinc">
          {loan.minimumLoanAmount} - {loan.maximumLoanAmount}{" "}
          {generateChainDenomination(chainId)}
        </Tag>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span>{loan.originationFeeNumerator / 100}%</span>
          <Tooltip>
            <TooltipTrigger>
              <CircleAlertIcon className="text-muted-foreground h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <span>
                This fee is a percentage charged at the origination of the loan
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <span>0.1 {generateChainDenomination(chainId)}</span>
          <Tooltip>
            <TooltipTrigger>
              <CircleAlertIcon className="text-muted-foreground h-3 w-3" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <span>
                The liquidation fee is repaid upon liquidation. This is
                necessary to ensure the loan is satisfied if payments aren't
                made, which is a safeguard and a common practice.
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
      <TableCell className="content-start px-2 pb-4">
        <div className="flex flex-col items-start text-[12px]">
          <div className="flex justify-start">
            <span className="text-muted-foreground">Premium:</span>
            <span className="ml-1 font-semibold">
              {loan.numberOfPremiumPeriods}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="text-muted-foreground">Repayment:</span>
            <span className="ml-1 font-semibold">
              {loan.numberOfRepaymentPeriods}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="text-muted-foreground">Due:</span>
            <span className="ml-1 font-semibold">
              <Tag variant="large" color="sky">
                <span className="text-[10px] uppercase">{paymentDue}</span>
              </Tag>
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div className="text-[12px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground mr-1">Loan Cost:</span>
                <span>{calculateLoanCost(loan)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground mr-1">
                  Liquidation Fee:
                </span>
                <span>0.1 {generateChainDenomination(chainId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground mr-1">
                  Initiation Fee:
                </span>
                <span>{loan.originationFeeNumerator / 100}%</span>
              </div>
              <div className="border-muted-foreground/20 mt-1 border-t pt-1 font-semibold">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span>--</span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <span>
              Estimated total cost of the loan, including loan cost, liquidation
              fee, and initiation fee
            </span>
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

function calculateTotalLoanCost(loan: any): number {
  const originationFee = loan.originationFeeNumerator / 100
  const premiumPeriods = loan.numberOfPremiumPeriods
  // Assuming a fixed premium rate of 1% per period (adjust as needed)
  const premiumRate = 1

  return originationFee + premiumPeriods * premiumRate
}

function calculateLoanCost(loan: any): number {
  const premiumPeriods = loan.numberOfPremiumPeriods
  // Assuming a fixed premium rate of 1% per period (adjust as needed)
  const premiumRate = 1
  return premiumPeriods * premiumRate
}
