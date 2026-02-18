import { cn } from "@x7/css"
import { ChevronRightIcon } from "@x7/icons"
import { buttonVariants } from "@x7/ui/button"
import { LinkInternal } from "@x7/ui/link"
import type { ChainId, LoanType } from "@x7/utils"
import { generateChainShortName } from "@x7/utils"

interface LoansCellProps {
  id: number
  chainId: ChainId
  loanType: LoanType
}

export function LoanCellMore({ id, chainId, loanType }: LoansCellProps) {
  return (
    <div className="float-right pr-4">
      <div className="flex w-full justify-center">
        {id >= 0 ? (
          <LinkInternal
            prefetch={true}
            href={`/lending/${generateChainShortName(
              chainId
            )}/${loanType}/${id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "inline-flex"
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
  )
}
