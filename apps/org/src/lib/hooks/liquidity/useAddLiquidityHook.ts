/* oxlint-disable @typescript-eslint/no-floating-promises */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-argument */
/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

import { useCallback, useEffect, useMemo } from "react";
import type { Address, WriteContractReturnType } from "viem";
import { useSimulateContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

import type { Amount, ChainId, Currency, Native } from "@x7/utils";
import { gasMargin, LogCodes } from "@x7/utils";

import {
  ApprovalState,
  useTokenApproval,
} from "~/lib/hooks/approvals/useTokenApproval";
import { useWeb3Config } from "~/lib/providers/web3";
import { log } from "~/lib/utils/log";
import { getXchangeRouterContractConfig } from "../../config/getXchangeRouterContract";

interface UseAddLiquidityProps {
  token0: Currency | Native | undefined;
  token1: Currency | Native | undefined;
  chainId: ChainId;
  input0: Amount<Currency | Native> | undefined;
  input1: Amount<Currency | Native> | undefined;
  address: Address | undefined;
  minAmount0: Amount<Currency | Native> | undefined;
  minAmount1: Amount<Currency | Native> | undefined;
  deadline: bigint | undefined;
  mutation: {
    onSuccess: (data: `0x${string}`) => void;
    onError: (e: Error) => void;
  };
  contract: Address | undefined;
}

interface UseAddLiquidityReturn {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  write: ((confirm: () => void) => Promise<void>) | undefined;
  isPending: boolean;
  status: "idle" | "error" | "pending" | "success";
}

export function useAddLiquidity({
  token0,
  token1,
  chainId,
  input0,
  input1,
  address,
  minAmount0,
  minAmount1,
  deadline,
  mutation,
  contract,
}: UseAddLiquidityProps): UseAddLiquidityReturn {
  const { wagmiConfig: config } = useWeb3Config();
  const [token0State] = useTokenApproval({
    amount: input0,
    spender: contract,
    enabled: true,
  });
  const [token1State] = useTokenApproval({
    amount: input1,
    spender: contract,
    enabled: true,
  });

  const isInputValid = useMemo(() => {
    return Boolean(
      token0 &&
        token1 &&
        input0?.quotient &&
        input1?.quotient &&
        address &&
        minAmount0?.quotient &&
        minAmount1?.quotient &&
        deadline &&
        contract,
    );
  }, [
    token0,
    token1,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    deadline,
    contract,
  ]);

  const prepareNative = useCallback(() => {
    if (!isInputValid) {
      return undefined;
    }

    const contract = getXchangeRouterContractConfig(chainId);

    const isToken0Native = token0?.isNative;
    const tokenAddress = isToken0Native
      ? token1?.wrapped.address
      : token0?.wrapped.address;
    const tokenAmount = isToken0Native ? input1?.quotient : input0?.quotient;
    const ethAmount = isToken0Native ? input0?.quotient : input1?.quotient;

    const tokenMinAmount = isToken0Native
      ? minAmount1?.quotient
      : minAmount0?.quotient;
    const ethMinAmount = isToken0Native
      ? minAmount0?.quotient
      : minAmount1?.quotient;

    const args = [
      tokenAddress,
      tokenAmount,
      tokenMinAmount,
      ethMinAmount,
      address,
      deadline,
    ] as const;

    return {
      account: address,
      address: contract.address,
      chainId: chainId,
      abi: contract.abi,
      functionName: "addLiquidityETH",
      args,
      value: ethAmount,
    } as const;
  }, [
    isInputValid,
    token0,
    token1,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    deadline,
    chainId,
  ]);

  const prepareNonNative = useCallback(() => {
    if (!isInputValid) {
      return undefined;
    }

    const contract = getXchangeRouterContractConfig(chainId);
    const args = [
      token0?.wrapped.address,
      token1?.wrapped.address,
      input0?.quotient,
      input1?.quotient,
      minAmount0?.quotient,
      minAmount1?.quotient,
      address,
      deadline,
    ] as const;

    return {
      account: address,
      address: contract.address,
      chainId: chainId,
      abi: contract.abi,
      functionName: "addLiquidity",
      args,
    } as const;
  }, [
    isInputValid,
    token0,
    token1,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    deadline,
    chainId,
  ]);

  const prepare = useMemo(() => {
    if (
      !isInputValid ||
      token0State !== ApprovalState.APPROVED ||
      token1State !== ApprovalState.APPROVED
    ) {
      return undefined;
    }

    const isWithNative = token0?.isNative || token1?.isNative;
    return isWithNative ? prepareNative() : prepareNonNative();
  }, [
    isInputValid,
    token0,
    token1,
    token0State,
    token1State,
    prepareNative,
    prepareNonNative,
  ]);

  const { data: simulation, error: simulationError } = useSimulateContract({
    ...(prepare ?? {}),
    query: {
      enabled: Boolean(prepare),
      retry: false,
    },
  } as any);

  const {
    writeContractAsync,
    writeContract: _,
    isPending,
    isError,
    error: writeError,
    status,
    ...rest
  } = useWriteContract({
    mutation: {
      ...mutation,
      onSuccess: (hash: WriteContractReturnType) => {
        waitForTransactionReceipt(config, {
          hash,
          pollingInterval: 2_500,
          retryDelay: 2_500,
        });
      },
    },
  });

  // const { status } = ;

  const write = useMemo(() => {
    if (!writeContractAsync || !simulation?.request) return undefined;

    return async (confirm: () => void) => {
      try {
        const tx = await writeContractAsync({
          ...simulation.request,
          gas: simulation.request.gas
            ? gasMargin(simulation.request.gas)
            : undefined,
        });
        mutation.onSuccess(tx);
        confirm();
      } catch (error) {
        log.error(LogCodes.FAIL, "Error adding liquidity", { error });
        if (error instanceof Error) {
          mutation.onError(error);
        } else {
          mutation.onError(new Error("Failed to add liquidity"));
        }
      }
    };
  }, [writeContractAsync, simulation, mutation]);

  useEffect(() => {
    if (simulationError) {
      log.error(LogCodes.FAIL, "Error simulating contract", {
        error: simulationError,
      });
    }
  }, [simulationError]);

  return {
    isLoading: isPending,
    isError: isError || Boolean(simulationError),
    error: writeError || simulationError || null,
    write: isInputValid ? write : undefined,
    isPending,
    status,
    ...rest,
  };
}
