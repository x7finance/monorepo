import { useLocalStorage } from "./use-local-storage";

export const useRecipientAddressState = (
  key?: string,
  defaultValue?: boolean,
) => useLocalStorage(key ?? "recipientAddressState", defaultValue ?? false);

export const useRecipientAddress = (key?: string, defaultValue?: string) =>
  useLocalStorage(key ?? "recipientAddress", defaultValue ?? "");
