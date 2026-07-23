"use client"

import { useLocalStorage } from "./use-local-storage"

export const useSlippageTolerance = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "swapSlippage", defaultValue ?? "0.1")
