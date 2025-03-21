/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useChainId } from "wagmi";

import { GlobeIcon, Telegram, Twitter } from "@x7/icons";
import { getChainLogo } from "@x7/ui";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@x7/ui/card";
import { LinkExternal, LinkInternal } from "@x7/ui/link";
import { SkeletonBox } from "@x7/ui/skeleton";
import { TimeAgo } from "@x7/ui/time-ago";
import type { ChainId } from "@x7/utils";
import { formatUSD, shortenAddress } from "@x7/utils";

import { ChainsArray } from "~/lib/components/utils/contracts-dropdown";
// import type { TokenWithTimestamp } from "~/lib/hooks/tokens/useCreatedXchangeTokens";
import { useTokenData } from "~/lib/hooks/tokens/useTokenData";

export function TokenCard({ token }: { token: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chainId = useChainId();

  const {
    data: {
      name,
      symbol,
      tokenOwner,
      description,
      reserves,
      marketCap,
      websiteLink,
      telegramLink,
      twitterLink,
      bannerUrl,
      logoUrl,
    },
    isLoading,
  } = useTokenData(token.address, { skipHistoricalData: true });

  // Check if this token is currently selected
  const isSelected = searchParams.get("token0") === token.address;

  // Get the block explorer URL for the current chain
  const blockExplorer = ChainsArray.find(
    (chain) => chain.id === chainId,
  )?.scannerLink;

  // Check ETH liquidity before rendering
  if (reserves.ethReserve && Number(reserves.ethReserve) < 0.1) {
    return null;
  }

  return (
    <Card
      className={`group relative flex h-full w-full cursor-pointer flex-col overflow-hidden border transition-all duration-300 ${
        isSelected
          ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/50"
          : "border-zinc-200 dark:border-zinc-800"
      } hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] dark:hover:border-emerald-400`}
      onClick={() => {
        // Create new URLSearchParams object with current params
        const params = new URLSearchParams(searchParams);
        params.set("token0", "NATIVE");
        params.set("token1", token.address);
        params.set("swapAmount", "0.01");

        // Update the mobile tab to show swap
        params.set("tab", "swap");

        // Use router.push to update the URL
        router.push(`?${params.toString()}`);
      }}
    >
      <div className="font-heading absolute right-3 bottom-3 text-xl font-bold text-zinc-400/30 transition-all duration-300 group-hover:text-green-400/80">
        Buy
      </div>
      <CardHeader className="relative p-0">
        <div className="relative mb-2 h-24 w-full">
          <Image
            src={bannerUrl ?? "/images/placeholder/moon.webp"}
            alt={`${token.address}-image`}
            fill
            className={`rounded-t-lg object-cover ${!bannerUrl ? "brightness-50" : ""}`}
          />
        </div>
        {logoUrl && (
          <div className="absolute right-2 bottom-8 flex flex-col items-center">
            <div className="h-16 w-16 overflow-hidden rounded-lg border-2 border-white bg-white shadow-xs dark:border-zinc-100 dark:bg-zinc-900">
              <Image
                src={logoUrl ?? "/images/placeholder/token.webp"}
                alt={`${token.address}-logo`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        <CardTitle className="p-3 pt-1 text-sm font-bold">
          {isLoading ? (
            <SkeletonBox className="h-5 w-32" />
          ) : (
            `${name} (${symbol})`
          )}
          <p className="text-xs font-semibold text-green-500">
            Market Cap:&nbsp;
            {!marketCap || marketCap === 0 ? "--" : formatUSD(marketCap)}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xs grow space-y-2 px-3 py-1">
        {description && (
          <p className="line-clamp-4 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          {websiteLink && (
            <LinkExternal
              href={websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <GlobeIcon className="h-4 w-4" />
            </LinkExternal>
          )}
          {telegramLink && (
            <LinkExternal
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <Telegram className="h-4 w-4" />
            </LinkExternal>
          )}
          {twitterLink && (
            <LinkExternal
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <Twitter className="h-4 w-4" />
            </LinkExternal>
          )}
          <LinkExternal
            href={`${blockExplorer}/address/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getChainLogo(chainId as ChainId)}
              alt="Chain Logo"
              width={16}
              height={16}
              className="mr-1 inline-block"
            />
          </LinkExternal>
          <LinkInternal
            prefetch={true}
            href={`/coin/${token.address}`}
            className="ml-auto text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={(e) => e.stopPropagation()} // Prevent card click event
          >
            More Details →
          </LinkInternal>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-3 text-[10px] text-zinc-500">
        <div>
          <span>Contract:&nbsp;</span>
          <LinkExternal
            href={`${blockExplorer}/address/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-800 transition-colors hover:text-blue-500 hover:underline dark:text-zinc-200"
          >
            {shortenAddress(token.address)}
          </LinkExternal>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            Created&nbsp;by&nbsp;
            {tokenOwner && (
              <LinkExternal
                href={`${blockExplorer}/address/${tokenOwner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-blue-500 hover:underline"
              >
                {shortenAddress(tokenOwner)}
              </LinkExternal>
            )}
            &nbsp;
            <span className="text-zinc-800 dark:text-zinc-200">
              <TimeAgo value={new Date(token.timestamp * 1000)} />
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
