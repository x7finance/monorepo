/* oxlint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

import type { Address } from "viem";
import { useReadContracts } from "wagmi";

import { X7LendingPoolV2 } from "@x7/contracts";
import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId } from "@x7/utils";

import { getChainInfo } from "~/lib/constants/chainInfo";

export function useActiveLoanTerms(id: bigint, chainId: ChainId) {
  const { data, isLoading: isInitialActiveLoanTerms } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "activeLoanTerms",
        args: [id],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialActiveLoanTerms,
    activeLoanTerms: data?.[0]?.result!,
  };
}

export function useActiveLoansByBorrower(address: Address, chainId: ChainId) {
  const { data, isLoading: isInitialActiveLoansByBorrower } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "activeLoansByBorrower",
        args: [address],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialActiveLoansByBorrower,
    activeLoansByBorrower: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  };
}

export function useCanLiquidate(tokenByIndex: number, chainId: ChainId) {
  const { data, isLoading: isInitialCanLiquidate } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "canLiquidate",
        args: [BigInt(tokenByIndex)],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialCanLiquidate,
    canLiquidate: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  };
}

export function useCountOfActiveLoans(chainId: ChainId) {
  const { data, isLoading: isCountOfActiveLoans } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "countOfActiveLoanTerms",
        chainId,
      },
    ],
  });

  return {
    isLoading: isCountOfActiveLoans,
    countOfActiveLoans: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10)
      : 0,
  };
}

export function useLiquidationReward(chainId: ChainId) {
  const { data, isLoading: isInitialLiquidationReward } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "liquidationReward",
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialLiquidationReward,
    liquidationReward: BigInt(data?.[0]?.result?.toString() ?? "0"),
    liquidationRewardDecimal: data?.[0]?.result
      ? parseInt(data[0].result.toString() ?? "0", 10) /
        10 ** getChainInfo(chainId).nativeCurrency.decimals
      : 0,
  };
}

export function useLoanBorrower(tokenByIndex: number, chainId: ChainId) {
  const { data, isLoading: isInitialLoanBorrower } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "loanBorrower",
        args: [BigInt(tokenByIndex)],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialLoanBorrower,
    loanBorrower: data?.[0]?.result?.toString() ?? "",
  };
}

export function useLoanLookupByBorrower(
  address: Address,
  activeCount: bigint,
  chainId: ChainId,
) {
  const { data, isLoading: isInitialLoanLookupByBorrower } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "loanLookupByBorrower",
        args: [address, activeCount],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialLoanLookupByBorrower,
    loanLookupByBorrower: parseInt(data?.[0]?.result?.toString() ?? "0", 10),
  };
}

export function useLoanPair(tokenByIndex: number, chainId: ChainId) {
  const { data, isLoading: isInitialLoanPair } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "loanPair",
        args: [BigInt(tokenByIndex)],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialLoanPair,
    loanPair: data?.[0]?.result?.toString() ?? "",
  };
}

export function useLoanTermLookUp(tokenByIndex: number, chainId: ChainId) {
  const { data, isLoading: isInitialLoanTermLookUp } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "loanTermLookup",
        args: [BigInt(tokenByIndex)],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialLoanTermLookUp,
    loanTermLookUp: data?.[0]?.result?.toString() ?? "",
  };
}

export function useLoanToken(tokenByIndex: number, chainId: ChainId) {
  const { data, isLoading: isInitialLoanToken } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "loanToken",
        args: [BigInt(tokenByIndex)],
        chainId,
      },
    ],
  });

  return {
    isLoading: isInitialLoanToken,
    loanToken: data?.[0]?.result?.toString() ?? "",
  };
}

export function useNextLoanID(chainId: ChainId) {
  const { data, isLoading: isInitialNextLoanID } = useReadContracts({
    contracts: [
      {
        address: X7ContractsEnum.X7_LendingPool(chainId),
        abi: X7LendingPoolV2,
        functionName: "nextLoanID",
        chainId,
      },
    ],
  });
  return {
    isLoading: isInitialNextLoanID,
    nextLoanID: parseInt(data?.[0]?.result?.toString() ?? "0", 10),
  };
}
