/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatEther } from "viem";

import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId } from "@x7/utils";

export function useLendingPoolData(
  chainId: ChainId,
  poolBalanceData: any,
  reserveBalanceData: any,
  ReadContractData: any,
  lendingPoolContractAddress: string,
) {
  const [statusData, setStatusData] = useState({
    available: "0",
    escrow: "0",
    liquidationReward: "0",
    loanCount: 0,
    poolBalance: "0",
    reserveBalance: "0",
    totalBalance: "0",
    liveLoans: 0,
  });
  const [splitData, setSplitData] = useState<any[]>([]);
  const [utilizedData, setUtilizedData] = useState<any[]>([]);

  useEffect(() => {
    if (poolBalanceData && reserveBalanceData && ReadContractData) {
      const availableValue = parseFloat(
        formatEther(BigInt(ReadContractData?.[2]?.result ?? "0")),
      );
      const escrowValue = parseFloat(
        formatEther(BigInt(ReadContractData?.[1]?.result ?? "0")),
      );
      const liquidationRewardValue = parseFloat(
        formatEther(BigInt(ReadContractData?.[3]?.result ?? "0")),
      );
      const loanCountValue =
        parseInt(ReadContractData?.[0]?.result?.toString() ?? "0", 10) - 1;
      const poolBalanceValue = parseFloat(
        formatEther(BigInt(poolBalanceData?.value ?? 0)),
      );
      const reserveBalanceValue = parseFloat(
        formatEther(BigInt(reserveBalanceData?.value ?? 0)),
      );
      const totalBalanceValue = poolBalanceValue + reserveBalanceValue;
      const liveLoansValue = liquidationRewardValue
        ? Math.ceil(escrowValue / liquidationRewardValue)
        : 0;

      setStatusData({
        available: availableValue.toFixed(2),
        escrow: escrowValue.toFixed(2),
        liquidationReward: liquidationRewardValue.toFixed(2),
        loanCount: loanCountValue === -1 ? 0 : loanCountValue,
        poolBalance: poolBalanceValue.toFixed(2),
        reserveBalance: reserveBalanceValue.toFixed(2),
        totalBalance: totalBalanceValue.toFixed(2),
        liveLoans: liveLoansValue,
      });

      const poolPercentage = totalBalanceValue
        ? (poolBalanceValue / totalBalanceValue) * 100
        : 0;
      const reservePercentage = totalBalanceValue
        ? (reserveBalanceValue / totalBalanceValue) * 100
        : 0;
      const availablePercentage = poolBalanceValue
        ? (availableValue / poolBalanceValue) * 100
        : 0;
      const utilizedPercentage = poolBalanceValue
        ? (escrowValue / poolBalanceValue) * 100
        : 0;

      setSplitData([
        {
          label: "Lending Pool",
          chain: chainId,
          value: Math.round(poolPercentage),
          address: { result: lendingPoolContractAddress },
        },
        {
          label: "Lending Pool Reserve",
          chain: chainId,
          value: Math.round(reservePercentage),
          address: { result: X7ContractsEnum.LendingPoolReserve(chainId) },
        },
      ]);

      setUtilizedData([
        {
          label: "Available",
          chain: chainId,
          value: Math.round(availablePercentage),
          address: { result: lendingPoolContractAddress + "#readContract#F11" },
        },
        {
          label: "Utilized",
          chain: chainId,
          value: Math.round(utilizedPercentage),
          address: { result: lendingPoolContractAddress + "#readContract#F31" },
        },
      ]);
    }
  }, [
    chainId,
    poolBalanceData,
    reserveBalanceData,
    ReadContractData,
    lendingPoolContractAddress,
  ]);

  return { statusData, splitData, utilizedData };
}
