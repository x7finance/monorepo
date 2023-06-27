import { BlockchainType, ContractsEnum, LoanType } from "common"
import {
  generateChainBase,
  generateX7InitialLiquidityLoanTermContract,
} from "utils"
import {
  X7InitialLiquidityLoanTerm001,
  X7InitialLiquidityLoanTerm002,
  X7InitialLiquidityLoanTerm003,
  X7LendingPoolV1,
} from "contracts"

import { useContractReads } from "wagmi"

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
  const timestamp = Math.floor(Date.now() / 1000)
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
        functionName: "getTotalDue",
        args: [tokenByIndex, Math.floor(Date.now() / 1000)],
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
        functionName: "getPremiumsDue",
        args: [tokenByIndex, timestamp],
        chainId: generateWagmiChain(chainId),
      },
      {
        address: loanAddress,
        abi: selectContract(loanType) as any,
        functionName: "getPrincipalDue",
        args: [tokenByIndex, timestamp],
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
    ],
  })
  return {
    fullLoanAddress: `${generateChainBase(
      chainId
    )}/address/${loanAddress}#code`,
    isLoading: isInitialPairLoading || isInitialTokenIndex,
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
    totalDue: data?.[6]?.result
      ? parseInt(data?.[6]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    loanState: parseInt(data?.[7]?.result?.toString() ?? "0", 10) || 0,
    getPrincipalPaymentSchedule: data?.[8]?.result,
    getPremiumPaymentSchedule: data?.[9]?.result,
    canLiquidate: data?.[10]?.result
      ? parseInt(data?.[10]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    loanBorrower: data?.[11]?.result?.toString() ?? "",
    loanToken: data?.[12]?.result?.toString() ?? "",
    loanPair: data?.[13]?.result?.toString() ?? "",
    originationFeeCollected: data?.[14]?.result
      ? parseInt(data?.[14]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    premiumAmount: data?.[15]?.result
      ? parseInt(data?.[15]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    premiumAmountPaid: data?.[16]?.result
      ? parseInt(data?.[16]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    getRemainingLiablity: data?.[17]?.result
      ? parseInt(data?.[17]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    getPremiumsDue: data?.[18]?.result
      ? parseInt(data?.[18]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    getPrincipalDue: data?.[19]?.result
      ? parseInt(data?.[19]?.result?.toString() ?? "0", 10) / 10 ** 18
      : 0,
    numberOfPremiumPeriods:
      parseInt(data?.[20]?.result?.toString() ?? "0", 10) || 0,
    numberOfRepaymentPeriods:
      parseInt(data?.[21]?.result?.toString() ?? "0", 10) || 0,
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
