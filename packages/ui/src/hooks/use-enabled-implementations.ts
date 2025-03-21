"use client";

import { useLocalStorage } from "./use-local-storage";

export const useEnabledImplentations = (key?: string, defaultValue?: string) =>
  useLocalStorage(
    key ?? "enabledImplementations",
    defaultValue ?? "UNISWAP,XCHANGE",
  );
