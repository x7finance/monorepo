"use client"

import { BlockchainType } from "common"
import {
  cn,
  generateChainBase,
  generateChainDenomination,
  generateX7InitialLiquidityLoanTermContract,
} from "utils"
import {
  AlertCircle,
  CheckCircleIcon,
  ClipboardIcon,
  FlagIcon,
  FlagOffIcon,
} from "icons"

import Link from "next/link"
import { useClipboard } from "use-clipboard-copy"

import { useXchangeLoanData } from "@/lib/hooks/useXchangeLoanData"
import { toast } from "@/components/ui/use-toast"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

interface LoansProps {
  id: number
  chainId: BlockchainType
  loanType: string
}

export function Loan({ id, chainId, loanType }: LoansProps) {
  const {
    loanID,
    symbol,
    ownerOf,
    isCompleted,
    loanAmount,
    loanStartTime,
    totalDue,
    loanState,
    fullLoanAddress,
    canLiquidate,
  } = useXchangeLoanData(id, chainId, loanType)

  const clipboard = useClipboard({
    onSuccess() {
      return toast({
        title: "Success",
        description: "Address Copied",
        variant: "success",
      })
    },
  })

  return (
    <tr key={id}>
      <td
        className={cn(
          id === 0 ? "" : "border-t border-transparent",
          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
        )}
      >
        <div
          className={`font-medium ${
            loanState === 1
              ? "text-green-500 dark:text-green-500"
              : "text-red-500 dark:text-red-500"
          } dark:text-zinc-100`}
        >
          <>
            {loanID ? `${loanID} / ${id}` : ". . ."}
            <div className="relative inline-block ml-2 top-1 lg:hidden">
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 space-x-1">{symbol}</div>
              </div>
            </div>
          </>
        </div>
        <div className="flex flex-col mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:block lg:hidden">
          <span className="flex items-center cursor-pointer opacity-70 hover:underline dark:opacity-50">
            Status : {isCompleted ? "Completed" : "Active"}
          </span>
          <span className="flex items-center cursor-pointer opacity-70 hover:underline dark:opacity-50">
            Total Due : {totalDue}
          </span>
        </div>
        {id !== 0 ? (
          <div className="bg-zinc-900/7.5 absolute -top-px left-6 right-0 h-px dark:bg-white/10" />
        ) : null}
      </td>

      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <span>
          Loan Type:{" "}
          <Link
            className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
            href={fullLoanAddress}
            target="_blank"
            rel="noopener noreferrer"
          >
            {symbol}
          </Link>
        </span>
        <span
          onClick={() => {
            clipboard.copy(ownerOf)
          }}
          className="flex group cursor-pointer items-center opacity-70 dark:opacity-50"
        >
          Address: <span className="group-hover:underline">{ownerOf}</span>
          <span className="ml-0.5">
            <ClipboardIcon
              className="inline-block h-4 w-4 "
              aria-hidden="true"
            />
            <span className="sr-only">Copy Address</span>
          </span>
        </span>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "relative py-4 pl-1 pr-3 text-sm sm:pl-1"
        )}
      >
        <div className="flex items-center justify-center space-x-4">
          <span className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {isCompleted ? (
                    <CheckCircleIcon className=" text-green-500" />
                  ) : (
                    <AlertCircle className="text-yellow-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <span>{isCompleted ? "Completed" : "Active"}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {canLiquidate > 0 ? (
                    <FlagIcon className=" text-green-500" />
                  ) : (
                    <FlagIcon className="text-red-500" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    {canLiquidate > 0 ? "Liquidable" : "Non-Liquidable"}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            {loanAmount}
            <span className="pl-1">
              {generateChainDenomination(chainId as BlockchainType)}
            </span>
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <span>{totalDue.toFixed(6)}</span>
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-zinc-900/7.5 border-t dark:border-white/10",
          "hidden px-3 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell"
        )}
      >
        <span>{loanStartTime}</span>
      </td>
      <td
        className={cn(
          id === 0 ? "" : "border-t border-transparent",
          "relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
        )}
      >
        <div className="flex justify-center w-full">
          {loanID ? (
            <Link
              href={`${generateChainBase(
                chainId
              )}/token/${generateX7InitialLiquidityLoanTermContract(
                loanType
              )}?a=${loanID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center gap-0.5 overflow-hidden rounded-full bg-violet-400/20 px-3 py-1 text-sm font-medium text-violet-600 ring-1 ring-inset ring-violet-400/80 transition hover:bg-violet-400/70 hover:text-white hover:ring-violet-700 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20 dark:hover:bg-violet-400/10 dark:hover:text-violet-300 dark:hover:ring-violet-300"
            >
              <span className="whitespace-nowrap">
                <span>View</span>
                <span className="hidden xl:ml-1 xl:inline-block">
                  on Explorer
                </span>
              </span>
            </Link>
          ) : null}
        </div>
        {id !== 0 ? (
          <div className="bg-zinc-900/7.5 absolute -top-px left-0 right-6 h-px dark:bg-white/10" />
        ) : null}
      </td>
    </tr>
  )
}
