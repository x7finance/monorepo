import { useLocalStorage } from "./use-local-storage";

export const useDefaultTokenListDrawer = (
  key?: string,
  defaultValue?: boolean,
) => useLocalStorage(key ?? "defaultTokenListDrawer", defaultValue ?? false);
