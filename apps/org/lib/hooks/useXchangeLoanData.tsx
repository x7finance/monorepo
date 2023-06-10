import { BlockchainType, ContractsEnum } from "common"
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
  loanType: string
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
        address: ContractsEnum.X7_LendingPool,
        abi: X7LendingPoolV1 as any,
        functionName: "canLiquidate",
        args: [tokenByIndex],
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
    canLiquidate: data?.[8]?.result
      ? parseInt(data?.[8]?.result?.toString() ?? "0", 10) / 10 ** 18
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
