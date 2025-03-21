import { useLocalStorage } from ".";

export const useColorHue = (key?: string, defaultValue?: boolean) =>
  useLocalStorage(key ?? "colorHue", defaultValue ?? false);
