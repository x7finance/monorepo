// import { useQuery } from "@tanstack/react-query";
// import { getAddress, isAddress, parseUnits } from "viem";
// import { Fraction } from "@x7/utils";

interface UsePrices {
  _chainId: number | undefined
}

export const usePrices = ({ _chainId }: UsePrices) => {
  return {
    data: {},
  }
  // return useQuery({
  //   staleTime: 900000, // 15 mins
  //   gcTime: 3600000, // 1hr
  //   refetchOnWindowFocus: false,
  //   enabled: Boolean(chainId),
  // });
}
