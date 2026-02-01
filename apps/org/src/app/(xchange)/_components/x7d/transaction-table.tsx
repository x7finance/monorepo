/* oxlint-disable @typescript-eslint/no-unsafe-member-access */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable react-hooks/exhaustive-deps */

"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { getPublicClient } from "@wagmi/core";
import type { Log } from "viem";
import { formatEther } from "viem";
import { useChainId, useWalletClient } from "wagmi";

import { X7ContractsEnum } from "@x7/sdk";
import { LinkExternal } from "@x7/ui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@x7/ui/table";
import { TableLoadingShimmer } from "@x7/ui/table-loading-shimmer";
import type { ChainId } from "@x7/utils";
import {
  formatDateTime,
  generateChainDenomination,
  getRandomPioneerNumber,
} from "@x7/utils";

import { LoadingPioneer } from "~/lib/components/core/loading-pioneer";
import { useIsComponentReady } from "~/lib/hooks/utils/useIsComponentReady";
import { useWeb3Config } from "~/lib/providers/web3";
import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink";

const transferEventTopic =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const X7D_STARTING_BLOCK = 16418166n;

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: string;
}

export function X7DTransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const isComponentReady = useIsComponentReady();
  const [isLoading, setIsLoading] = useState(true);
  const chainId = useChainId() as ChainId;

  const { wagmiConfig } = useWeb3Config();

  const publicClient: any = getPublicClient(wagmiConfig);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);

      if (walletClient?.account.address) {
        const walletAddress = walletClient.account.address.toLowerCase();
        const logs: any = await publicClient.getLogs({
          address: [X7ContractsEnum.X7D(chainId)],
          topics: [
            transferEventTopic,
            null,
            `0x000000000000000000000000${walletAddress.slice(2)}`,
          ],
          fromBlock: X7D_STARTING_BLOCK,
          toBlock: "latest",
        });

        const filteredLogs = logs.filter((log: Log) => {
          if (log.topics[1] && log.topics[2]) {
            const from = "0x" + log.topics[1].slice(-40).toLowerCase();
            const to = "0x" + log.topics[2].slice(-40).toLowerCase();
            const isTx = from === walletAddress || to === walletAddress;
            return isTx;
          }
        });

        const parsedTransactions: Transaction[] = await Promise.all(
          filteredLogs.map(async (log: Log) => {
            const from = "0x" + log.topics[1]!.slice(-40).toLowerCase();
            const to = "0x" + log.topics[2]!.slice(-40).toLowerCase();
            const block = await publicClient.getBlock({
              blockHash: log.blockHash,
            });
            const value = BigInt(log.data);
            const timestamp = block.timestamp.toString() ?? "";

            return {
              hash: log.transactionHash,
              from,
              to,
              value,
              timestamp,
            };
          }),
        );

        setTransactions(parsedTransactions);
      }
      setIsLoading(false);
    };

    void fetchTransactions();
  }, [walletClient?.account.address]);

  return (
    <>
      {isComponentReady ? (
        <Suspense fallback={<TableLoadingShimmer />}>
          {isLoading ? (
            <LoadingPioneer />
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.hash}
                    className="bg-white dark:bg-zinc-900"
                  >
                    <TableCell className="px-2">
                      <LinkExternal
                        href={getExplorerLink(
                          chainId,
                          transaction.hash,
                          ExplorerDataType.TRANSACTION,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500"
                      >
                        {truncateHash(transaction.hash)}
                      </LinkExternal>
                    </TableCell>
                    <TableCell className="px-2 text-zinc-500 dark:text-zinc-400">
                      {formatEther(transaction.value)}{" "}
                      {`${generateChainDenomination(chainId)}`}
                    </TableCell>
                    <TableCell className="px-2">
                      {transaction.to ===
                      walletClient?.account.address.toLowerCase()
                        ? "Deposit"
                        : "Withdrawal"}
                    </TableCell>
                    <TableCell className="px-2 text-zinc-500 dark:text-zinc-400">
                      {formatDateTime(parseInt(transaction.timestamp), true)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <div className="mb-4 flex items-center justify-center">
                <Image
                  alt={`Random Pioneer Image`}
                  height={100}
                  width={100}
                  src={`https://assets.x7finance.org/pioneers/${getRandomPioneerNumber()}.png`}
                  className="h-20 w-20 flex-none rounded-full ring-[2px] ring-zinc-400/20"
                />
              </div>
              <p className="text-xl font-medium text-zinc-500">
                No X7D transactions found.
              </p>
              <p className="mt-2 text-zinc-400 dark:text-zinc-600">
                Deposit X7D to see your transaction history here.
              </p>
            </div>
          )}
        </Suspense>
      ) : (
        <TableLoadingShimmer />
      )}
    </>
  );
}

function truncateHash(hash: string, length = 8): string {
  if (hash.length <= length * 2 + 2) {
    return hash;
  }
  const prefix = hash.slice(0, length);
  const suffix = hash.slice(-length);
  return `${prefix}...${suffix}`;
}
