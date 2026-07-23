import { useLocalStorage } from "./use-local-storage"

export const useTradePercentage = (key?: string, defaultValue?: boolean) =>
  useLocalStorage(key ?? "tradePercentage", defaultValue ?? false)
