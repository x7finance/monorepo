/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

import { ChainLinkAbi } from "@x7/contracts";
import {
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CogIcon,
} from "@x7/icons";
import { WETH_ADDRESS } from "@x7/sdk";
import { Button } from "@x7/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@x7/ui/card";
import { SkeletonBox } from "@x7/ui/skeleton";
import { Tag } from "@x7/ui/tag";
import type { ActiveChainId } from "@x7/utils";
import {
  formatUSD,
  generateChainTokenOracleEtherUSDEnum,
  Native,
  Token,
} from "@x7/utils";

import { usePrice } from "~/lib/hooks/prices/usePrice";
import type { UserPositionsResponse } from "~/lib/hooks/tokens/useGetAllUserTokens";
import { AddLiquidityTab } from "./tabs/add-liquidity";
import { RemoveLiquidityTab } from "./tabs/remove-liquidity";
import { SyncLiquidityTab } from "./tabs/sync-liquidity";

export const LiquidityPositionRow = ({
  position,
  chainId,
  view = "default",
}: {
  position: UserPositionsResponse;
  chainId: ActiveChainId;
  view?: "small" | "default";
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "remove" | "sync">("add");

  const [liquidityToken, setLiquidityToken] = useState<Token>();
  const [token0, setToken0] = useState<Token | Native>();
  const [token1, setToken1] = useState<Token | Native>();

  const ethUsdOracleAddress = generateChainTokenOracleEtherUSDEnum(chainId);

  const { data: ethUsdPrice, isLoading: isEthUsdPriceLoading } =
    useReadContract({
      address: ethUsdOracleAddress,
      abi: ChainLinkAbi,
      functionName: "latestAnswer",
    });

  const { data: priceToken0InEth, isLoading: isPriceLoadingToken0 } = usePrice({
    chainId,
    currency: token0,
  });

  const { data: priceToken1InEth, isLoading: isPriceLoadingToken1 } = usePrice({
    chainId,
    currency: token1,
  });

  const token0UsdValue =
    token0 && priceToken0InEth && ethUsdPrice
      ? token0.isNative
        ? (Number(position.token0.maxShare) /
            Number(`1e${position.token0.decimals}`)) *
          (Number(ethUsdPrice) / 1e8)
        : (Number(position.token0.maxShare) /
            Number(`1e${position.token0.decimals}`)) *
          Number(priceToken0InEth.toExact()) *
          (Number(ethUsdPrice) / 1e8)
      : 0;

  const token1UsdValue =
    token1 && priceToken1InEth && ethUsdPrice
      ? token1.isNative
        ? (Number(position.token1.maxShare) /
            Number(`1e${position.token1.decimals}`)) *
          (Number(ethUsdPrice) / 1e8)
        : (Number(position.token1.maxShare) /
            Number(`1e${position.token1.decimals}`)) *
          Number(priceToken1InEth.toExact()) *
          (Number(ethUsdPrice) / 1e8)
      : 0;
  const tokenValueDifference =
    Math.abs(token0UsdValue - token1UsdValue) /
    Math.max(token0UsdValue, token1UsdValue);
  const isSynced =
    position.ownership < 75 ||
    (tokenValueDifference <= 0.2 &&
      position.token0.balance !== 0n &&
      position.token1.balance !== 0n);
  useEffect(() => {
    if (position.token0) {
      if (WETH_ADDRESS(chainId) === position.token0.address) {
        setToken0(Native.onChain(chainId));
      } else {
        setToken0(
          new Token({
            chainId,
            address: position.token0.address,
            symbol: position.token0.symbol,
            decimals: position.token0.decimals,
            name: position.token0.symbol,
          }),
        );
      }
    }

    if (position.token1) {
      if (WETH_ADDRESS(chainId) === position.token1.address) {
        setToken1(Native.onChain(chainId));
      } else {
        setToken1(
          new Token({
            chainId,
            address: position.token1.address,
            symbol: position.token1.symbol,
            decimals: position.token1.decimals,
            name: position.token1.symbol,
          }),
        );
      }
    }

    if (position.contractAddress) {
      setLiquidityToken(
        new Token({
          chainId,
          address: position.contractAddress,
          symbol: "X7-AMM",
          decimals: position.decimals ?? 18,
          name: `${position.token0.symbol}/${position.token1.symbol}`,
        }),
      );
    }
  }, [position]);

  return (
    <>
      <tr className="border-b border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
        <td className="px-3 py-4 text-sm">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">
            {position.token0.symbol} / {position.token1.symbol}
          </div>
          <div className="text-zinc-500 dark:text-zinc-400">
            <Tag variant="large" color="zinc">
              <span className="whitespace-nowrap text-[10px] sm:text-xs">
                {position.ownership.toFixed(2)}% Pool Share
              </span>
            </Tag>
          </div>
        </td>
        <td className="px-3 py-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            <span className="text-[10px] sm:text-xs">
              {(
                Number(position.token0.maxShare) /
                Number(`1e${position.token0.decimals}`)
              ).toFixed(5)}{" "}
            </span>
            <span className="text-xs font-semibold text-black dark:text-white">
              {position.token0.symbol}
            </span>
          </div>
          <div>
            <span className="text-[10px] sm:text-xs">
              {(
                Number(position.token1.maxShare) /
                Number(`1e${position.token1.decimals}`)
              ).toFixed(5)}{" "}
            </span>
            <span className="text-xs font-semibold text-black dark:text-white">
              {position.token1.symbol}
            </span>
          </div>
        </td>
        <td className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
          {isPriceLoadingToken0 || isPriceLoadingToken1 ? (
            <SkeletonBox className="h-[32px] w-[64px]" />
          ) : (
            <Tag variant="large" color="emerald">
              {formatUSD(token0UsdValue + token1UsdValue)}
            </Tag>
          )}
        </td>
        {view !== "small" && (
          <td className="px-3 py-4 text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="secondary"
                size="xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <span className="hidden items-center sm:flex">
                      Close <ChevronUpIcon className="ml-1 h-4 w-4" />
                    </span>
                    <span className="block sm:hidden">
                      <CogIcon className="h-4 w-4" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hidden items-center sm:flex">
                      Manage
                      {!isSynced &&
                        !isPriceLoadingToken0 &&
                        !isPriceLoadingToken1 && (
                          <AlertCircleIcon className="ml-2 h-4 w-4 text-red-600" />
                        )}
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </span>
                    <span className="block sm:hidden">
                      <CogIcon className="h-4 w-4" />
                    </span>
                  </>
                )}
              </Button>
            </div>
          </td>
        )}
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-3 py-4">
            <Card className="mx-auto mt-4 max-w-2xl">
              <CardHeader className="space-y-1 px-3 sm:px-6">
                <CardDescription className="space-x-2 text-muted-foreground">
                  <Button
                    variant={activeTab === "add" ? "primary" : "ghost"}
                    className={
                      activeTab === "add" ? "" : "border-2 border-transparent"
                    }
                    size="sm"
                    onClick={() => setActiveTab("add")}
                  >
                    Add Liquidity
                  </Button>
                  <Button
                    variant={activeTab === "remove" ? "primary" : "ghost"}
                    className={
                      activeTab === "remove"
                        ? ""
                        : "border-2 border-transparent"
                    }
                    size="sm"
                    onClick={() => setActiveTab("remove")}
                  >
                    Remove Liquidity
                  </Button>
                  {!isSynced &&
                    !isPriceLoadingToken0 &&
                    !isPriceLoadingToken1 && (
                      <Button
                        variant={activeTab === "sync" ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("sync")}
                      >
                        Sync
                        <AlertCircleIcon className="ml-2 h-4 w-4 text-red-600" />
                      </Button>
                    )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-3 sm:px-6">
                {activeTab === "add" && (
                  <AddLiquidityTab
                    chainId={chainId}
                    token0={token0!}
                    token1={token1!}
                  />
                )}
                {activeTab === "remove" && (
                  <RemoveLiquidityTab
                    position={position}
                    liquidityToken={liquidityToken!}
                    chainId={chainId}
                    token0={token0!}
                    token1={token1!}
                  />
                )}
                {activeTab === "sync" && (
                  <SyncLiquidityTab
                    position={position}
                    liquidityToken={liquidityToken!}
                    chainId={chainId}
                    token0={token0!}
                    token1={token1!}
                  />
                )}
              </CardContent>
            </Card>
          </td>
        </tr>
      )}
    </>
  );
};
