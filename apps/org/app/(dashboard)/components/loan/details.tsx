import {
  BlockchainType,
  ChainEnum,
  ChainShortNameEnum,
  ChainShortNameType,
  LoanType,
} from "common"
import {
  cn,
  generateChainBase,
  generateX7InitialLiquidityLoanTermContract,
} from "utils"
import { buttonVariants } from "ui-server"
import { ChevronRightIcon } from "icons"

import Link from "next/link"

interface LoanProps {
  loanId: string
  loanType: LoanType
  chain: ChainShortNameType
}

function generateChainIdByName(chain: ChainShortNameType): BlockchainType {
  switch (chain) {
    case ChainShortNameEnum.erc:
      return ChainEnum.erc
    case ChainShortNameEnum.bsc:
      return ChainEnum.bsc
    case ChainShortNameEnum.polygon:
      return ChainEnum.polygon
    case ChainShortNameEnum.arbitrum:
      return ChainEnum.arbitrum
    case ChainShortNameEnum.optimism:
      return ChainEnum.optimism
    default:
      return ChainEnum.erc
  }
}

export function LoanDetails(props: LoanProps) {
  const { loanId, loanType, chain } = props

  const chainId = generateChainIdByName(chain)

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <Link
        href={`${generateChainBase(
          chainId
        )}/token/${generateX7InitialLiquidityLoanTermContract(
          loanType
        )}?a=${loanId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "sm",
          }),
          "inline-flex"
        )}
      >
        <span className="whitespace-nowrap flex items-center">
          <span>View On Chain</span>
          <span>
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </span>
        </span>
      </Link>
      loan details: {loanId}
    </div>
  )
}
