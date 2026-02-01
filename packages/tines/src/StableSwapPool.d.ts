import type { Address } from "viem";
import type { RToken } from "./PrimaryPools";
import { RPool } from "./PrimaryPools";
export interface Rebase {
    elastic: bigint;
    base: bigint;
}
export declare function toAmountBI(share: bigint, total: Rebase): bigint;
export declare function toShareBI(elastic: bigint, total: Rebase): bigint;
export declare class RebaseInternal {
    elastic2Base: number;
    rebaseBI: Rebase;
    constructor(rebase: Rebase);
    toAmount(share: number): number;
    toShare(amount: number): number;
    toAmountBI(share: bigint): bigint;
}
export declare function realReservesToAdjusted(reserve: bigint, total: Rebase, decimals: number): bigint;
export declare function adjustedReservesToReal(reserve: bigint, total: Rebase, decimals: number): bigint;
export declare class StableSwapRPool extends RPool {
    k: bigint;
    decimals0: number;
    decimals1: number;
    decimalsCompensation0: number;
    decimalsCompensation1: number;
    total0: RebaseInternal;
    total1: RebaseInternal;
    constructor(address: Address, token0: RToken, token1: RToken, fee: number, reserve0: bigint, reserve1: bigint, decimals0: number, decimals1: number, total0: Rebase, total1: Rebase);
    getReserve0(): bigint;
    getReserve1(): bigint;
    granularity0(): number;
    granularity1(): number;
    updateReserves(res0: bigint, res1: bigint): void;
    updateReservesAmounts(res0: bigint, res1: bigint): void;
    getTotal0(): Rebase;
    getTotal1(): Rebase;
    updateTotals(total0: Rebase, total1: Rebase): void;
    updateTotal0(total0: Rebase): void;
    updateTotal1(total1: Rebase): void;
    computeK(): bigint;
    computeY(x: bigint, yHint: bigint): bigint;
    calcOutByIn(amountIn: number, direction: boolean, throwIfOutOfLiquidity?: boolean): {
        out: number;
        gasSpent: number;
    };
    calcOutByInReal(amountIn: number, direction: boolean): number;
    calcInByOut(amountOut: number, direction: boolean): {
        inp: number;
        gasSpent: number;
    };
    calcCurrentPriceWithoutFee(direction: boolean): number;
}
//# sourceMappingURL=StableSwapPool.d.ts.map