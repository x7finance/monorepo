import type { Address } from "viem";
import type { RToken } from "./PrimaryPools";
import { RPool } from "./PrimaryPools";
export declare const CL_MIN_TICK = -887272;
export declare const CL_MAX_TICK: number;
export interface CLTick {
    index: number;
    DLiquidity: bigint;
}
export declare class CLRPool extends RPool {
    tickSpacing: number;
    liquidity: bigint;
    sqrtPriceX96: bigint;
    nearestTick: number;
    ticks: CLTick[];
    constructor(address: Address, token0: RToken, token1: RToken, fee: number, tickSpacing: number, reserve0: bigint, reserve1: bigint, liquidity: bigint, sqrtPriceX96: bigint, nearestTick: number, ticks: CLTick[]);
    calcOutByIn(amountIn: number, direction: boolean): {
        out: number;
        gasSpent: number;
    };
    calcInByOut(amountOut: number, direction: boolean): {
        inp: number;
        gasSpent: number;
    };
    calcCurrentPriceWithoutFee(direction: boolean): number;
}
//# sourceMappingURL=CLPool.d.ts.map