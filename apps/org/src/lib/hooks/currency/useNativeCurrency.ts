"use client";

import { useMemo } from "react";

import { ChainId, Native } from "@x7/utils";

export function useNativeCurrency({
  chainId = ChainId.ETHEREUM,
}: {
  chainId?: ChainId;
}): Native {
  return useMemo(() => Native.onChain(chainId), [chainId]);
}
