import type { MultiRoute, NetworkInfo } from "./Graph";
import type { RPool, RToken } from "./PrimaryPools";
export declare function findMultiRouteExactIn(from: RToken, to: RToken, amountIn: bigint | number, pools: RPool[], baseTokenOrNetworks: RToken | NetworkInfo[], gasPrice?: number, flows?: number | number[]): MultiRoute;
export declare function findMultiRouteExactOut(from: RToken, to: RToken, amountOut: bigint | number, pools: RPool[], baseTokenOrNetworks: RToken | NetworkInfo[], gasPrice?: number, flows?: number | number[]): MultiRoute;
export declare function findSingleRouteExactIn(from: RToken, to: RToken, amountIn: bigint | number, pools: RPool[], baseTokenOrNetworks: RToken | NetworkInfo[], gasPrice?: number): MultiRoute;
export declare function findSingleRouteExactOut(from: RToken, to: RToken, amountOut: bigint | number, pools: RPool[], baseTokenOrNetworks: RToken | NetworkInfo[], gasPrice?: number): MultiRoute;
export declare function calcTokenPrices(pools: RPool[], baseToken: RToken, minPriceLiquidity?: number, priceLogging?: boolean): Map<RToken, number>;
//# sourceMappingURL=MultiRouter.d.ts.map