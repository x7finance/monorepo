"use client";

import { usePathname } from "next/navigation";
import { useChainId } from "wagmi";

import { cn } from "@x7/css";
import { useColorHue } from "@x7/ui";
import { ChainId } from "@x7/utils";

export function BackgroundColorHue() {
  const chainId = useChainId() as ChainId;
  const [colorHue] = useColorHue();
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[-1] h-screen w-screen overflow-hidden",
        colorHue && generateChainColorHue(chainId),
      )}
    />
  );
}

function generateChainColorHue(id: ChainId) {
  switch (id) {
    case ChainId.ETHEREUM:
      return "bg-linear-to-t from-transparent to-zinc-700/40";
    case ChainId.POLYGON:
      return "bg-linear-to-t from-transparent to-purple-700/40";
    case ChainId.ARBITRUM:
      return "bg-linear-to-t from-transparent to-blue-700/40";
    case ChainId.OPTIMISM:
      return "bg-linear-to-t from-transparent to-red-700/40";
    case ChainId.BSC:
      return "bg-linear-to-t from-transparent to-yellow-700/40";
    case ChainId.BASE:
      return "bg-linear-to-t from-transparent to-blue-500/40";
    default:
      return "bg-linear-to-t from-transparent to-zinc-700/40";
  }
}
