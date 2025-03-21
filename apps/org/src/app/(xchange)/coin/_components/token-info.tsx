/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import Image from "next/image";

import type { TokenData } from "~/lib/hooks/tokens/useTokenData";
import { TokenInfoSkeleton } from "./skeletons";

interface TokenInfoProps {
  token: TokenData;
}

export function TokenInfo({ token }: TokenInfoProps) {
  if (!token) {
    return <TokenInfoSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
        <Image
          src={token.bannerUrl ?? "/images/placeholder/moon.webp"}
          alt={`${token.name} Token Banner`}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-start gap-6">
        <div className="relative -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-white">
          <Image
            src={token.logoUrl ?? "/images/placeholder/moon.webp"}
            alt={`${token.name} Token Logo`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{token.name}</h1>
          <p className="mt-2 text-zinc-600">{token.symbol}</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">{token.formattedPriceInUsd}</p>
          <p className={token.priceChangeColor}>
            {token.formattedPercentChange24h}
          </p>
        </div>
      </div>

      <p className="text-zinc-600">{token.description}</p>

      <div className="flex justify-between gap-2 overflow-x-auto md:grid md:grid-cols-3 md:gap-4">
        <InfoCard title="Market Cap" value={token.formattedMarketCap} />
        <InfoCard title="Volume (24h)" value={token.formattedVolume24h} />
        <InfoCard
          title="Circulating Supply"
          value={token.formattedTotalSupply}
        />
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="min-w-fit md:rounded-lg md:border md:bg-card md:p-4">
      <p className="text-xs text-zinc-600 md:text-sm">{title}</p>
      <p className="mt-0.5 text-sm font-bold md:mt-1 md:text-lg">{value}</p>
    </div>
  );
}
