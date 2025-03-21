/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Config } from "@wagmi/core";
import { getWalletClient } from "@wagmi/core";

import type { SwapRoute } from "@x7/smart-order-router";
import type { CurrencyAmount, Native, Token } from "@x7/utils";

import { getTokenTransferApproval } from "./get-token-transfer-approval";

export async function executeRoute(routeInfo: {
  token0: Token | Native;
  swapAmount: CurrencyAmount<Token | Native>;
  route: SwapRoute | undefined;
  config: Config;
}): Promise<`0x${string}`> {
  const { token0, swapAmount, route, config } = routeInfo;
  const walletClient = await getWalletClient(config);

  if (!walletClient) {
    throw new Error("No Clients Detected!");
  }

  if (!walletClient.account.address) {
    throw new Error("Could not get address");
  }

  // Derive router that needs allowances based on method parameters,
  // we distinguish this already down the chain, no need to redo.
  const routerAddress: `0x${string}` = route?.methodParameters?.to ?? `0x`;

  // One last approval check
  const approval = await getTokenTransferApproval(
    token0,
    swapAmount,
    routerAddress,
    config,
  );

  if (!approval) {
    throw new Error("Could not get approval");
  }

  const res = await walletClient.sendTransaction({
    data: route?.methodParameters?.calldata as `0x${string}`,
    to: routerAddress,
    value: BigInt(route?.methodParameters?.value ?? 0),
    account: walletClient.account.address,
  });

  return res;
}
