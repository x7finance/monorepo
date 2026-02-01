import type { ChainId, LoanType } from "@x7/utils"

import { X7ContractsEnum } from "@x7/sdk"

export function generateX7InitialLiquidityLoanTermNumber(
  loantype: string,
  chainId: ChainId
) {
  switch (loantype.toLowerCase()) {
    case X7ContractsEnum.X7InitialLiquidityLoanTerm001(chainId).toLowerCase():
      return "001"
    case X7ContractsEnum.X7InitialLiquidityLoanTerm003(chainId).toLowerCase():
      return "003"
    case X7ContractsEnum.X7InitialLiquidityLoanTerm004(chainId).toLowerCase():
      return "004"
    case X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId).toLowerCase():
      return "005"
    default:
      return "001"
  }
}

export function generateX7InitialLiquidityLoanTermContract(
  loantype: LoanType,
  chainId: ChainId
) {
  switch (loantype) {
    case "001":
      return X7ContractsEnum.X7InitialLiquidityLoanTerm001(chainId)
    case "003":
      return X7ContractsEnum.X7InitialLiquidityLoanTerm003(chainId)
    case "004":
      return X7ContractsEnum.X7InitialLiquidityLoanTerm004(chainId)
    case "005":
      return X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId)
    default:
      return X7ContractsEnum.X7InitialLiquidityLoanTerm001(chainId)
  }
}
