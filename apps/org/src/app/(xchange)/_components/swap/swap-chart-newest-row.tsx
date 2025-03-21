import { useChainId } from "wagmi";

import { LinkExternal } from "@x7/ui/link";
import { generateChainIdentifier } from "@x7/utils";
import type { ChainId } from "@x7/utils";

import { useXchangeTokenData } from "~/lib/hooks/tokens/useXchangeTokenData";

interface PairsProps {
  id: number;

  order: number;
}

export function SwapChartNewestRow({ id, order }: PairsProps) {
  const { tokenName, tokenContract } = useXchangeTokenData(id);
  const chainId = useChainId() as ChainId;

  if (!tokenName) {
    return null;
  }

  return (
    <LinkExternal
      className="mx-4 text-xs font-medium tracking-tight dark:text-zinc-300"
      target="_blank"
      rel="noopener noreferrer"
      href={`https://www.dextools.io/app/en/${generateChainIdentifier(
        chainId,
      )}/pair-explorer/${tokenContract}`}
    >
      <span>
        <span className="mr-0.5 text-zinc-500">{order + 1}.</span>
        {`${tokenName}`}
      </span>
    </LinkExternal>
  );
}
