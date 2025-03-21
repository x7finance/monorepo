import { useLocalStorage } from "./use-local-storage";

export const useEtherscanApi = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "etherscanapi", defaultValue ?? "");

export const useBscscanApi = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "bscscanapi", defaultValue ?? "");

export const usePolygonScanApi = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "polygonscanapi", defaultValue ?? "");

export const useArbitrumScanApi = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "arbitrumscanapi", defaultValue ?? "");

export const useOptimismScanApi = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "optimismscanapi", defaultValue ?? "");
