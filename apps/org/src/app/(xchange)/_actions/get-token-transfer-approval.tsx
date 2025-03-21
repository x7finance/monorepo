/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Config } from "@wagmi/core";
import { getPublicClient, getWalletClient } from "@wagmi/core";
import { erc20Abi, getContract } from "viem";

import { LogCodes } from "@x7/utils";
import type { CurrencyAmount, Native, Token } from "@x7/utils";

import { log } from "~/lib/utils/log";

export async function getTokenTransferApproval(
  token: Token | Native,
  amount: CurrencyAmount<Token | Native>,
  routerAddress: `0x${string}`,
  config: Config,
) {
  if (token.isNative) {
    return true;
  }

  try {
    const publicClient = getPublicClient(config);
    const walletClient = await getWalletClient(config);

    const [address] = await walletClient.requestAddresses();

    const erc20Contract = getContract({
      address: token.address,
      abi: erc20Abi,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    });

    const allowance: bigint =
      (await publicClient?.readContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address!, routerAddress],
      })) ?? 0n;

    if (
      allowance &&
      (amount.lessThan(allowance) || amount.equalTo(allowance))
    ) {
      return allowance;
    } else {
      // @ts-expect-error: todo fix
      const { request } = await erc20Contract.simulate.approve(
        [routerAddress, amount.quotient],
        {
          account: address,
        },
      );

      return walletClient.writeContract(request);
    }
  } catch (error) {
    log.error(LogCodes.FAIL, `${error}`);
    return null;
  }
}
