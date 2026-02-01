import { useLocalStorage } from "./use-local-storage";

export const useColorHue = (key?: string, defaultValue?: boolean) =>
  useLocalStorage(key ?? "colorHue", defaultValue ?? false);
