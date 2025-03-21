import { useLocalStorage } from "./use-local-storage";

export const useTradeChartPanelNewest = (
  key?: string,
  defaultValue?: boolean,
) => useLocalStorage(key ?? "tradeChartPanelNewest", defaultValue ?? false);

export const useTradeChartPanelLiquidity = (
  key?: string,
  defaultValue?: boolean,
) => useLocalStorage(key ?? "tradeChartPanelLiquidity", defaultValue ?? false);
