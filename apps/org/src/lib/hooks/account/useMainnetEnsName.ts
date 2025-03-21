import { useEnsName } from "wagmi";

export function useMainnetEnsName(address: `0x${string}` | undefined) {
  const { data: ensName } = useEnsName({
    address,
  });

  return ensName;
}
