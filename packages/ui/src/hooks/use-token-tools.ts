import { useLocalStorage } from "./use-local-storage"

export const useTokenTools = (key?: string, defaultValue?: boolean) =>
  useLocalStorage(key ?? "tokenTools", defaultValue ?? false)
