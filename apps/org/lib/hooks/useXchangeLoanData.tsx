import {
  X7InitialLiquidityLoanTerm001,
  X7InitialLiquidityLoanTerm002,
  X7InitialLiquidityLoanTerm003,
  X7LendingPoolV1,
} from "contracts"
import { useContractReads } from "wagmi"

import type { BlockchainType, LoanType } from "@x7/common"
import { ContractsEnum } from "@x7/common"
import {
  generateChainBase,
  generateX7InitialLiquidityLoanTermContract,
} from "@x7/utils"

import { generateWagmiChain } from "../generateWagmiChain"

export function useXchangeLoanData(
  id: number,
  chainId: BlockchainType,
  loanType: LoanType
) {
  const loanAddress = generateX7InitialLiquidityLoanTermContract(loanType)

  const { data: token, isLoading: isInitialTokenIndex } = useContractReads({
    contracts: [
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "tokenByIndex",
        args: [id],
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const tokenByIndex = parseInt(token?.[0]?.result?.toString() ?? "0", 10) || 0
  // const timestamp = Math.floor(Date.now() / 1000)
  const { data, isLoading: isInitialPairLoading } = useContractReads({
    contracts: [
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "tokenByIndex",
        args: [id],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "symbol",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "ownerOf",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "isComplete",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "loanAmount",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "loanStartTime",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "loanState",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getPrincipalPaymentSchedule",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getPremiumPaymentSchedule",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: ContractsEnum.X7_LendingPool,
        abi: X7LendingPoolV1 as any,
        functionName: "canLiquidate",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: ContractsEnum.X7_LendingPool,
        abi: X7LendingPoolV1 as any,
        functionName: "loanBorrower",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: ContractsEnum.X7_LendingPool,
        abi: X7LendingPoolV1 as any,
        functionName: "loanToken",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: ContractsEnum.X7_LendingPool,
        abi: X7LendingPoolV1 as any,
        functionName: "loanPair",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "originationFeeCollected",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "premiumAmount",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "premiumAmountPaid",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getRemainingLiability",
        args: [tokenByIndex],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "numberOfPremiumPeriods",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "numberOfRepaymentPeriods",
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "liquidationAmount",
        args: [id],
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  const premiumsDateArray = data?.[8]?.result?.[0]
  const premiumsDateArrayLength =
    parseInt(data?.[17]?.result?.toString() ?? "0", 10) || 0
  const premiumsLastDate = premiumsDateArray?.[premiumsDateArrayLength - 1]

  const principalDateArray = data?.[7]?.result?.[0]
  const principalDateArrayLength =
    parseInt(data?.[18]?.result?.toString() ?? "0", 10) || 0
  const principalLastDate = principalDateArray?.[principalDateArrayLength - 1]

  const { data: dataDue, isLoading: isDuePairLoading } = useContractReads({
    contracts: [
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getPremiumsDue",
        args: [tokenByIndex, premiumsLastDate],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getPrincipalDue",
        args: [tokenByIndex, principalLastDate],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getTotalDue",
        args: [
          tokenByIndex,
          premiumsLastDate > principalLastDate
            ? premiumsLastDate
            : principalLastDate,
        ],
        chainId: generateWagmiChain(chainId),
      },
    ],
  })

  return {
    fullLoanAddress: `${generateChainBase(
      chainId
    )}/address/${loanAddress}#code`,
    isLoading: isInitialPairLoading || isInitialTokenIndex || isDuePairLoading,
    loanID: parseInt(data?.[0]?.result?.toString() ?? "0", 10) || 0,
    symbol: data?.[1]?.result?.toString() ?? "",
    ownerOf: data?.[2]?.result?.toString() ?? "",
    isCompleted: data?.[3]?.result,
    loanAmount: data?.[4]?.result
      ? parseInt(data?.[4]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    loanStartTime: data?.[5]?.result
      ? new Date(
          parseInt(data?.[5]?.result?.toString() ?? "0", 10) * 1000
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        })
      : "",
    loanState: parseInt(data?.[6]?.result?.toString() ?? "0", 10) || 0,
    getPrincipalPaymentSchedule: data?.[7]?.result,
    getPremiumPaymentSchedule: data?.[8]?.result,
    canLiquidate: data?.[9]?.result
      ? parseInt(data?.[9]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    loanBorrower: data?.[10]?.result?.toString() ?? "",
    loanToken: data?.[11]?.result?.toString() ?? "",
    loanPair: data?.[12]?.result?.toString() ?? "",
    originationFeeCollected: data?.[14]?.result
      ? parseInt(data?.[13]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    premiumAmount: data?.[14]?.result
      ? parseInt(data?.[14]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    premiumAmountPaid: data?.[15]?.result
      ? parseInt(data?.[15]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    getRemainingLiablity: data?.[16]?.result
      ? parseInt(data?.[16]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    numberOfPremiumPeriods:
      parseInt(data?.[17]?.result?.toString() ?? "0", 10) || 0,
    numberOfRepaymentPeriods:
      parseInt(data?.[18]?.result?.toString() ?? "0", 10) || 0,
    liquidationAmount:
      data?.[19]?.result === undefined
        ? -1
        : parseInt(data?.[19]?.result?.toString() ?? "0", 10),
    getPremiumsDue: dataDue?.[0]?.result
      ? parseInt(dataDue?.[0]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    getPrincipalDue: dataDue?.[1]?.result
      ? parseInt(dataDue?.[1]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    totalDue: dataDue?.[2]?.result
      ? parseInt(dataDue?.[2]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
  }
}

function selectContract(loanType: string) {
  switch (loanType) {
    case ContractsEnum.X7InitialLiquidityLoanTerm001:
      return X7InitialLiquidityLoanTerm001
    case ContractsEnum.X7InitialLiquidityLoanTerm002:
      return X7InitialLiquidityLoanTerm002
    case ContractsEnum.X7InitialLiquidityLoanTerm003:
      return X7InitialLiquidityLoanTerm003
    default:
      return X7InitialLiquidityLoanTerm001
  }
}
