import type { Address } from "viem";
export declare const TYPICAL_SWAP_GAS_COST = 60000;
export declare const TYPICAL_MINIMAL_LIQUIDITY = 1000;
export interface RToken {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    chainId?: number | string;
    tokenId?: string;
}
export declare function setTokenId(...tokens: RToken[]): void;
export declare abstract class RPool {
    readonly address: Address;
    token0: RToken;
    token1: RToken;
    readonly fee: number;
    reserve0: bigint;
    reserve1: bigint;
    readonly minLiquidity: number;
    readonly swapGasCost: number;
    constructor(address: Address, token0: RToken, token1: RToken, fee: number, reserve0: bigint, reserve1: bigint, minLiquidity?: number, swapGasCost?: number);
    updateReserves(res0: bigint, res1: bigint): void;
    getReserve0(): bigint;
    getReserve1(): bigint;
    abstract calcOutByIn(amountIn: number, direction: boolean): {
        out: number;
        gasSpent: number;
    };
    abstract calcInByOut(amountOut: number, direction: boolean): {
        inp: number;
        gasSpent: number;
    };
    abstract calcCurrentPriceWithoutFee(direction: boolean): number;
    calcOutByInReal(amountIn: number, direction: boolean): number;
    granularity0(): number;
    granularity1(): number;
    alwaysAppropriateForPricing(): boolean;
}
export declare class ConstantProductRPool extends RPool {
    reserve0Number: number;
    reserve1Number: number;
    constructor(address: Address, token0: RToken, token1: RToken, fee: number, reserve0: bigint, reserve1: bigint);
    updateReserves(res0: bigint, res1: bigint): void;
    calcOutByIn(amountIn: number, direction: boolean): {
        out: number;
        gasSpent: number;
    };
    calcOutByInReal(amountIn: number, direction: boolean): number;
    calcInByOut(amountOut: number, direction: boolean): {
        inp: number;
        gasSpent: number;
    };
    calcCurrentPriceWithoutFee(direction: boolean): number;
    calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number;
    calcInputByPrice(price: number, direction: boolean, takeFeeIntoAccount: boolean): number;
    getLiquidity(): number;
}
export declare class HybridRPool extends RPool {
    readonly A: number;
    readonly A_PRECISION = 100;
    D: bigint;
    constructor(address: Address, token0: RToken, token1: RToken, fee: number, A: number, reserve0: bigint, reserve1: bigint);
    updateReserves(res0: bigint, res1: bigint): void;
    computeLiquidity(): bigint;
    computeY(x: bigint): bigint;
    calcOutByIn(amountIn: number, direction: boolean): {
        out: number;
        gasSpent: number;
    };
    calcInByOut(amountOut: number, direction: boolean): {
        inp: number;
        gasSpent: number;
    };
    calcCurrentPriceWithoutFee(direction: boolean): number;
    calcPrice(amountIn: number, direction: boolean, takeFeeIntoAccount: boolean): number;
    calcInputByPrice(price: number, direction: boolean, takeFeeIntoAccount: boolean, hint?: number): number;
}
//# sourceMappingURL=PrimaryPools.d.ts.map