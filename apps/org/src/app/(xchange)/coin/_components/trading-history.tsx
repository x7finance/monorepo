/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { getBlockNumber, getLogs } from "viem/actions";
import { useChainId, usePublicClient } from "wagmi";

import { computePairAddress } from "@x7/sdk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@x7/ui/table";
import type { ChainId } from "@x7/utils";
import { Implementation, Token, WETH9 } from "@x7/utils";

interface Trade {
  timestamp: number;
  type: "buy" | "sell";
  amount: bigint;
  price: number;
  total: number;
  address: string;
}

interface TradingHistoryProps {
  contractAddress: string;
}

export function TradingHistory({ contractAddress }: TradingHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const client = usePublicClient();
  const chainId = useChainId();

  useEffect(() => {
    const fetchTradingHistory = async () => {
      const mockToken = new Token({
        chainId: chainId as ChainId,
        address: contractAddress as `0x${string}`,
        decimals: 18,
        symbol: "",
        name: "",
      });

      const pairAddress = computePairAddress({
        pairType: Implementation.XCHANGE,
        tokenA: mockToken,
        tokenB: WETH9[chainId as ChainId],
      });

      const blockNumber = await getBlockNumber(client!);
      const logs = await getLogs(client!, {
        event: {
          name: "Swap",
          type: "event",
          inputs: [
            { indexed: true, type: "address", name: "sender" },
            { type: "uint256", name: "amount0In" },
            { type: "uint256", name: "amount1In" },
            { type: "uint256", name: "amount0Out" },
            { type: "uint256", name: "amount1Out" },
            { indexed: true, type: "address", name: "to" },
          ],
        },
        address: pairAddress,
        fromBlock: blockNumber - 100_000n, // Last 2000 blocks
        toBlock: blockNumber,
      });

      // parse logs
      const trades = logs.map((log) => {
        const { sender, amount0In, amount1In, amount0Out, amount1Out, to } =
          log.args;

        const isToken0 = mockToken.sortsBefore(WETH9[chainId as ChainId]);

        const direction = isToken0
          ? amount0In! > 0n
            ? "sell"
            : "buy"
          : amount1Out! > 0n
            ? "buy"
            : "sell";

        // For sells: amount{N}In > 0 (token going in), amount{M}Out > 0 (WETH going out)
        // For buys:  amount{N}Out > 0 (token going out), amount{M}In > 0 (WETH going in)
        const amount = isToken0
          ? direction === "buy"
            ? amount0Out!
            : amount0In! // if token0, use amount0
          : direction === "buy"
            ? amount1Out!
            : amount1In!; // if token1, use amount1
        const price = isToken0
          ? direction === "buy"
            ? amount1In! / amount0Out! // buy:  WETH in / token out
            : amount1Out! / amount0In! // sell: WETH out / token in
          : direction === "buy"
            ? amount0In! / amount1Out! // buy:  WETH in / token out
            : amount0Out! / amount1In!; // sell: WETH out / token in
        const total = isToken0
          ? direction === "buy"
            ? amount1In!
            : amount1Out! // WETH amount
          : direction === "buy"
            ? amount0In!
            : amount0Out!; // WETH amount

        return {
          blockNumber: Number(log.blockNumber),
          type: direction,
          amount,
          price,
          total,
          address: sender,
        };
      });

      // setTrades(trades);
    };

    fetchTradingHistory();
  }, [contractAddress]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold">Trading History</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, i) => (
            <TableRow key={i}>
              <TableCell>
                {new Date(trade.timestamp).toLocaleTimeString()}
              </TableCell>
              <TableCell
                className={
                  trade.type === "buy" ? "text-green-500" : "text-red-500"
                }
              >
                {trade.type.toUpperCase()}
              </TableCell>
              <TableCell>{formatEther(trade.amount)}</TableCell>
              <TableCell>${trade.price}</TableCell>
              <TableCell>${trade.total}</TableCell>
              <TableCell>{trade.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
