import { AlertCircle, CheckCircleIcon, FlagIcon, XCircleIcon } from "@x7/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  // @ts-expect-error todo: fix this
} from "@x7/ui/tooltip"

type IconAlertsProps = {
  liquidationAmount: number
  canLiquidate: number
  loanState: number
}

export function IconAlerts({
  liquidationAmount,
  canLiquidate,
  loanState,
}: IconAlertsProps) {
  return (
    <div className="flex space-x-2">
      <span className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {liquidationAmount === -1 ? (
                <XCircleIcon className="ml-4 h-5 w-5 text-red-500" />
              ) : loanState === 0 ? (
                <AlertCircle className="ml-4 h-5 w-5 text-yellow-500" />
              ) : loanState === 1 ? (
                <CheckCircleIcon className="ml-4 h-5 w-5 text-green-500" />
              ) : (
                <></>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <span>
                {liquidationAmount === -1
                  ? "Liquidated"
                  : loanState === 0
                  ? "Loan Active"
                  : loanState === 1
                  ? "Loan Paid"
                  : ""}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
      <span className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {canLiquidate > 0 ? (
                <FlagIcon className=" h-5 w-5 text-green-500" />
              ) : (
                <FlagIcon className="h-5 w-5 text-red-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <span>{canLiquidate > 0 ? "Liquidable" : "Non-Liquidable"}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  )
}
