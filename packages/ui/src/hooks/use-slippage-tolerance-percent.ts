"use client"

import { useMemo } from "react"

import { Percent } from "@x7/utils"

import { useLocalStorage } from "./use-local-storage"

export const useSlippageTolerancePercent = (
  key: string | undefined = "swapSlippage"
) => {
  const [slippageTolerance, setSlippageTolerance] = useLocalStorage<
    number | string
  >(key, 0.1)

  return useMemo(
    () =>
      [
        new Percent(
          Math.floor(
            Number(slippageTolerance === "AUTO" ? "0.1" : slippageTolerance) *
              100
          ),
          10_000
        ),
        setSlippageTolerance,
      ] as const,
    [slippageTolerance, setSlippageTolerance]
  )
}
