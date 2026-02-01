/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import type { Hex } from "viem";

import type { MultiRoute, RouteLeg, RToken } from "@x7/tines";
import { RouteStatus } from "@x7/tines";
import type { ChainId } from "@x7/utils";

import type { PoolCode } from "./pools/PoolCode";
import type { PermitData } from "./TinesToRouteProcessor2";
import {
  getTokenType,
  TinesToRouteProcessor2,
  TokenType,
} from "./TinesToRouteProcessor2";

class TinesToRouteProcessor4 extends TinesToRouteProcessor2 {
  override getRouteProcessorCode(
    route: MultiRoute,
    toAddress: string,
    permits: PermitData[] = [],
  ): Hex | "" {
    // 0. Check for no route
    if (route.status === RouteStatus.NoWay || route.legs.length === 0)
      return "";

    //this.presendedLegs = new Set()
    this.calcTokenOutputLegs(route);
    let res = "0x";

    res += this.processPermits(permits);

    const processedTokens = new Set<string | undefined>();
    route.legs.forEach((l, i) => {
      const token = l.tokenFrom;
      if (processedTokens.has(token.tokenId)) return;
      processedTokens.add(token.tokenId);

      if (this.isOnePoolOptimization(token, route))
        res += this.processOnePoolCode(token, route, toAddress);
      else {
        switch (getTokenType(token)) {
          case TokenType.NATIVE:
            res += this.processNativeCode(token, route, toAddress);
            break;
          case TokenType.ERC20:
            res += this.processERC20Code(i > 0, token, route, toAddress);
            break;
          case TokenType.BENTO:
            res += this.processBentoCode(token, route, toAddress);
            break;
          default:
            throw new Error(`Unknown token type of token ${token.symbol}`);
        }
      }
    });

    return res as Hex;
  }

  override isOnePoolOptimization(token: RToken, route: MultiRoute) {
    if (getTokenType(token) === TokenType.NATIVE) return false;
    const outputDistribution = this.tokenOutputLegs.get(token.tokenId!) ?? [];
    if (outputDistribution.length !== 1) return false;
    if (token.tokenId === route.fromToken.tokenId) return false;

    const startPoint =
      outputDistribution[0] &&
      this.getPoolCode(outputDistribution[0]).getStartPoint(
        outputDistribution[0],
        route,
      );
    return startPoint === outputDistribution[0]?.poolAddress;
  }

  override swapCode(
    leg: RouteLeg,
    route: MultiRoute,
    toAddress: string,
  ): string {
    const pc = this.getPoolCode(leg);
    const to = this.getPoolOutputAddress(leg, route, toAddress);
    return pc.getSwapCodeForRouteProcessor4(leg, route, to);
  }
}

export function getRouteProcessor4Code(
  route: MultiRoute,
  routeProcessorAddress: string,
  toAddress: string,
  pools: Map<string, PoolCode>,
  permits: PermitData[] = [],
): string {
  const rpc = new TinesToRouteProcessor4(
    routeProcessorAddress,
    route.fromToken.chainId as ChainId,
    pools,
  );
  return rpc.getRouteProcessorCode(route, toAddress, permits);
}
