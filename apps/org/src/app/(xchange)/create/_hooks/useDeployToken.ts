/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BaseError } from "@wagmi/core";
import { toast } from "sonner";
import {
  decodeEventLog,
  keccak256,
  parseEther,
  toHex,
  UserRejectedRequestError,
} from "viem";
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import type {
  WriteContractErrorType,
  WriteContractReturnType,
} from "wagmi/actions";
import { waitForTransactionReceipt } from "wagmi/actions";

import { XchangeCreateAbi } from "@x7/contracts";
import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId } from "@x7/utils";

import { useTransactionStore } from "~/lib/providers/tx";
import { useWeb3Config } from "~/lib/providers/web3";
import { log } from "~/lib/utils/log";
import { LogCodes } from "@x7/utils";

interface TokenDeploymentParams {
  name: string;
  symbol: string;
  supply: bigint;
  teamTokens: number;
  loanTermContract: string;
  loanAmount: bigint;
  loanDurationSeconds: bigint;
  deadline: bigint;
  description: string;
  twitterLink: string;
  telegramLink: string;
  websiteLink: string;
  tokenURI: string;
  buyTax: number;
  sellTax: number;
  taxWallet: string;
  enabled?: boolean;
}

const eventSignatureHash = keccak256(
  toHex(
    "TokenDeployed(address,string,string,uint256,address,uint256,string,string,string,string,string,uint256,uint256,address)",
  ),
);

export function useDeployToken(params: TokenDeploymentParams) {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const chainId = useChainId() as ChainId;
  const { wagmiConfig: config } = useWeb3Config();
  const router = useRouter();
  const {
    mutate: { trackTransaction },
  } = useTransactionStore();

  const deployParams: TokenDeploymentParams = useMemo(
    () => ({
      name: params.name,
      symbol: params.symbol,
      supply: params.supply,
      teamTokens: params.teamTokens,
      newOwner: address!,
      loanTermContract: X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId),
      loanAmount: parseEther("1.0"),
      loanDurationSeconds: BigInt(604800),
      liquidityReceiver: address!,
      deadline: params.deadline,
      description: params.description,
      twitterLink: params.twitterLink,
      telegramLink: params.telegramLink,
      websiteLink: params.websiteLink,
      tokenURI: params.tokenURI,
      buyTax: params.buyTax,
      sellTax: params.sellTax,
      taxWallet: params.taxWallet,
    }),
    [
      params.name,
      params.symbol,
      params.description,
      params.supply,
      params.teamTokens,
      params.twitterLink,
      params.telegramLink,
      params.websiteLink,
      params.tokenURI,
      params.deadline,
      params.buyTax,
      params.sellTax,
      params.taxWallet,
      address,
      chainId,
    ],
  );

  const prepare = useMemo(() => {
    return {
      config,
      address: X7ContractsEnum.XChangeCreate(chainId),
      abi: XchangeCreateAbi,
      functionName: "deployTokenWithLoan",
      args: [deployParams],
      value: parseEther("0.0021"),
    };
  }, [config, chainId, deployParams]);

  const { data: simulation, error: simulationError } = useSimulateContract({
    ...prepare,
    query: {
      enabled: Boolean(address && params.enabled),
    },
  });

  if (simulationError) {
    log.warn(LogCodes.TX_SIMULATION_FAIL, "Token deployment simulation failed", {
      error: simulationError.message,
    });
  }

  const onSettled = useCallback(
    (hash: `0x${string}` | undefined, e: WriteContractErrorType | null) => {
      if (e instanceof Error) {
        if (!(e instanceof UserRejectedRequestError)) {
          toast.error((e as BaseError).shortMessage || e.message);
        }
        setIsPending(false);
        return;
      }

      if (hash) {
        setIsPending(true);
        trackTransaction({
          txHash: hash,
          type: "deployToken",
          summary: {
            pending: `Deploying token ${params.name}`,
            completed: `Successfully deployed token ${params.name}`,
            failed: `Failed to deploy token ${params.name}`,
          },
        });
      }
    },
    [params.name, trackTransaction],
  );

  const write = useWriteContract({
    mutation: {
      onSettled,
      onError: (error) => {
        log.error(LogCodes.TX_FAIL, "Token deployment transaction failed", {
          error: error.message,
        });
        setIsPending(false);
      },
      onSuccess: (hash: WriteContractReturnType) => {
        waitForTransactionReceipt(config, {
          hash,
          pollingInterval: 2_500,
          retryDelay: 2_500,
        })
          .then((receipt) => {
            const event = receipt.logs.find(
              (log) => log.topics[0] === eventSignatureHash,
            );

            if (event) {
              const decodedLog = decodeEventLog({
                abi: XchangeCreateAbi,
                data: event.data,
                topics: event.topics,
                eventName: "TokenDeployed",
              });

              const responseValues = decodedLog.args;
              if (responseValues && "tokenAddress" in responseValues) {
                toast.success(
                  "Token trading is live, your token is now available for trading @ the URL in your browser",
                );
                router.push(
                  `/swap?token0=NATIVE&token1=${responseValues.tokenAddress}&swapAmount=.01`,
                );
              }

              setIsPending(false);
            }
          })
          .catch((error) => {
            log.error(LogCodes.TX_FAIL, "Failed to get transaction receipt", {
              error: error instanceof Error ? error.message : String(error),
            });
            setIsPending(false);
          });
      },
    },
  });

  return useMemo(
    () => ({
      ...write,
      isPending,
      data: simulation,
    }),
    [write, isPending, simulation],
  );
}
