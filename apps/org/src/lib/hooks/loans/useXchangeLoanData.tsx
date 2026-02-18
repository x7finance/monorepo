/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-base-to-string */
import type { Address } from "viem"
import { useReadContracts } from "wagmi"

import {
  ERC20,
  X7InitialLiquidityLoanTerm001,
  X7InitialLiquidityLoanTerm003,
} from "@x7/contracts"
import type { X7ContractsEnum } from "@x7/sdk"
import type { ChainId, LoanType } from "@x7/utils"
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink"

import { generateX7InitialLiquidityLoanTermContract } from "../../utils/lending"

export function useGetPremiumsDue(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType,
  premiumsLastDate: number
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetPremiumsDue } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "getPremiumsDue",
        args: [tokenByIndex, premiumsLastDate],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetPremiumsDue,
    getPremiumsDueEther: data?.[0]?.result,
    getPremiumsDue: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

interface PremiumPaymentSchedule {
  isLoading: boolean
  getPremiumPaymentSchedule: any
}

export function useGetPremiumPaymentSchedule(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
): PremiumPaymentSchedule {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetPremiumPaymentSchedule } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "getPremiumPaymentSchedule",
          args: [tokenByIndex],
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialGetPremiumPaymentSchedule,
    getPremiumPaymentSchedule: data?.[0]?.result,
  }
}

export function useGetPrincipalDue(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType,
  prinicipalLastDate: number
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetPrincipalDue } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "getPrincipalDue",
        args: [tokenByIndex, prinicipalLastDate],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetPrincipalDue,
    getPrincipalDueEther: data?.[0]?.result,
    getPrincipalDue: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

interface PrincipalPaymentScheduleType {
  isLoading: boolean
  getPrincipalPaymentSchedule: any
}

export function useGetPrincipalPaymentSchedule(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
): PrincipalPaymentScheduleType {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetPrincipalPaymentSchedule } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "getPrincipalPaymentSchedule",
          args: [tokenByIndex],
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialGetPrincipalPaymentSchedule,
    getPrincipalPaymentSchedule: data?.[0]?.result,
  }
}

export function useGetRemainingLiability(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetRemainingLiability } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "getRemainingLiability",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetRemainingLiability,
    getRemainingLiability: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function useGetTotalDue(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType,
  premiumsLastDate: number,
  principalLastDate: number
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetTotalDue } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "getTotalDue",
        args: [
          tokenByIndex,
          premiumsLastDate > principalLastDate
            ? premiumsLastDate
            : principalLastDate,
        ],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetTotalDue,
    getTotalDueEther: data?.[0]?.result,
    getTotalDue: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function useIsComplete(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialIsComplete } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "isComplete",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialIsComplete,
    isComplete: data?.[0]?.result,
  }
}

export function useLiquidationAmount(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialLiquidationAmount } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "liquidationAmount",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialLiquidationAmount,
    liquidationAmount: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function useLoanAmount(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialLoanAmount } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "loanAmount",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialLoanAmount,
    loanAmount: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function useLoanState(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialLoanState } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "loanState",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialLoanState,
    loanState: parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function useLoanStartTime(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialLoanStartTime } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "loanStartTime",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialLoanStartTime,
    loanStartTime: data?.[0]?.result
      ? new Date(
          parseInt(data[0].result.toString() ?? "0", 10) * 1000
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
  }
}

export function useMaximumLoanAmount(chainId: ChainId, loanType: LoanType) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialMaximumLoanAmount } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "maximumLoanAmount",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialMaximumLoanAmount,
    maximumLoanAmount: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
    maximumLoanAmountEther: data?.[0]?.result,
  }
}

export function useMaximumLoanLengthSeconds(
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialMaximumLoanLengthSeconds } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "maximumLoanLengthSeconds",
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialMaximumLoanLengthSeconds,
    maximumLoanLengthSeconds: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  }
}

export function useMinimumLoanAmount(chainId: ChainId, loanType: LoanType) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialMinimumLoanAmount } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "minimumLoanAmount",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialMinimumLoanAmount,
    minimumLoanAmount: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
    minimumLoanAmountEther: data?.[0]?.result,
  }
}

export function useMinimumLoanLengthSeconds(
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialMinimumLoanLengthSeconds } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "minimumLoanLengthSeconds",
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialMinimumLoanLengthSeconds,
    minimumLoanLengthSeconds: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  }
}

export function useNumberOfPremiumPeriods(
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialNumberOfPremiumPeriods } = useReadContracts(
    {
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "numberOfPremiumPeriods",
          chainId,
        },
      ],
    }
  )

  return {
    isLoading: isInitialNumberOfPremiumPeriods,
    numberOfPremiumPeriods: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  }
}

export function useNumberOfRepaymentPeriods(
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialNumberOfRepaymentPeriods } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "numberOfRepaymentPeriods",
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialNumberOfRepaymentPeriods,
    numberOfRepaymentPeriods: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  }
}

export function useOriginationFeeCollected(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialOriginationFeeCollected } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "originationFeeCollected",
          args: [tokenByIndex],
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialOriginationFeeCollected,
    originationFeeCollected: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function useOwnerOf(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialOwnerOf } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "ownerOf",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialOwnerOf,
    ownerOf: data?.[0]?.result?.toString() ?? "",
  }
}

export function usePremiumAmount(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialPremiumAmount } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "premiumAmount",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialPremiumAmount,
    premiumAmount: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function usePremiumAmountPaid(
  tokenByIndex: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialPremiumAmountPaid } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "premiumAmountPaid",
        args: [tokenByIndex],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialPremiumAmountPaid,
    premiumAmountPaid: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

export function usePremiumFractions(
  index: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialPremiumFractions } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "premiumFractions",
        args: [index],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialPremiumFractions,
    premiumFractions: parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function usePremiumPeriodIndices(
  index: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialPremiumPeriodIndices } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "premiumPeriodIndices",
        args: [index],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialPremiumPeriodIndices,
    premiumPeriodIndices:
      parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function usePrincipleFractionDenominator(
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialPrincipleFractionDenominator } =
    useReadContracts({
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "principleFractionDenominator",
          chainId,
        },
      ],
    })

  return {
    isLoading: isInitialPrincipleFractionDenominator,
    principleFractionDenominator:
      parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function useRepaymentFractions(
  index: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialRepaymentFractions } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "repaymentFractions",
        args: [index],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialRepaymentFractions,
    repaymentFractions: parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function useRepaymentPeriodIndices(
  index: number,
  chainId: ChainId,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialRepaymentPeriodIndices } = useReadContracts(
    {
      contracts: [
        {
          address: loanAddress,
          abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
          functionName: "repaymentPeriodIndices",
          args: [index],
          chainId,
        },
      ],
    }
  )

  return {
    isLoading: isInitialRepaymentPeriodIndices,
    repaymentPeriodIndices:
      parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function useSymbol(id: number, chainId: ChainId, loanType: LoanType) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialSymbol } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "symbol",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialSymbol,
    symbol: data?.[0]?.result?.toString() ?? "",
  }
}

export function useTokenByIndex(
  id: number,
  chainId: ChainId,
  loanType: LoanType
): { isLoading: boolean; tokenByIndex: number } {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialTokenIndex } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "tokenByIndex",
        args: [id],
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialTokenIndex,

    tokenByIndex: parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
  }
}

export function useTokenSymbol(tokenAddress: string, chainId: ChainId) {
  const { data, isLoading: isInitialGetToKenSymbol } = useReadContracts({
    contracts: [
      {
        address: tokenAddress as Address,
        abi: ERC20 as any,
        functionName: "symbol",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetToKenSymbol,
    tokenSymbol: data?.[0]?.result?.toString() ?? "",
  }
}

export function useTokenName(tokenAddress: string, chainId: ChainId) {
  const { data, isLoading: isInitialGetToKenName } = useReadContracts({
    contracts: [
      {
        address: tokenAddress as Address,
        abi: ERC20 as any,
        functionName: "name",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetToKenName,
    tokenName: data?.[0]?.result?.toString() ?? "",
  }
}

export function useTotalLoanSupply(chainId: ChainId, loanType: LoanType) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  const { data, isLoading: isInitialGetTotalSupply } = useReadContracts({
    contracts: [
      {
        address: loanAddress,
        abi: selectAbi(loanType as keyof typeof X7ContractsEnum),
        functionName: "totalSupply",
        chainId,
      },
    ],
  })

  return {
    isLoading: isInitialGetTotalSupply,
    totalSupply: parseInt(data?.[0]?.result?.toString() ?? "0", 10),
  }
}

export function useFullLoanAddress(chainId: ChainId, loanType: LoanType) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(
    loanType,
    chainId
  )

  return {
    fullLoanAddress: getExplorerLink(
      chainId,
      loanAddress,
      ExplorerDataType.ADDRESS
    ),
  }
}

function selectAbi(loanType: keyof typeof X7ContractsEnum): any {
  switch (loanType) {
    case "X7InitialLiquidityLoanTerm001":
      return X7InitialLiquidityLoanTerm001
    case "X7InitialLiquidityLoanTerm003":
      return X7InitialLiquidityLoanTerm003
    default:
      return X7InitialLiquidityLoanTerm001
  }
}
