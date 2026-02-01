import type { Address } from "viem";
import type { RPool, RToken } from "./PrimaryPools";
export interface RouteLeg {
    poolType: "Stable" | "Classic" | "Unknown";
    poolAddress: Address;
    poolFee: number;
    tokenFrom: RToken;
    tokenTo: RToken;
    assumedAmountIn: number;
    assumedAmountOut: number;
    swapPortion: number;
    absolutePortion: number;
}
export declare enum RouteStatus {
    Success = "Success",
    NoWay = "NoWay",
    Partial = "Partial"
}
export interface MultiRoute {
    status: RouteStatus;
    fromToken: RToken;
    toToken: RToken;
    primaryPrice: number | undefined;
    swapPrice: number | undefined;
    priceImpact: number | undefined;
    amountIn: number;
    amountInBI: bigint;
    amountOut: number;
    amountOutBI: bigint;
    legs: RouteLeg[];
    gasSpent: number;
    totalAmountOut: number;
    totalAmountOutBI: bigint;
}
export declare function NoWayMultiRoute(from: RToken, to: RToken): MultiRoute;
export interface NetworkInfo {
    chainId: number | string | undefined;
    baseToken: RToken;
    gasPrice: number;
}
export declare class Edge {
    pool: RPool;
    vert0: Vertice;
    vert1: Vertice;
    canBeUsed: boolean;
    direction: boolean;
    amountInPrevious: number;
    amountOutPrevious: number;
    spentGas: number;
    spentGasNew: number;
    bestEdgeIncome: number;
    constructor(p: RPool, v0: Vertice, v1: Vertice);
    cleanTmpData(): void;
    reserve(v: Vertice): bigint;
    calcOutput(v: Vertice, amountIn: number): {
        out: number;
        gasSpent: number;
    };
    calcInput(v: Vertice, amountOut: number): {
        inp: number;
        gasSpent: number;
    };
    checkMinimalLiquidityExceededAfterSwap(from: Vertice, amountOut: number): boolean;
    testApply(from: Vertice, amountIn: number, amountOut: number): boolean;
    applySwap(from: Vertice): void;
}
export declare class Vertice {
    token: RToken;
    edges: Edge[];
    price: number;
    gasPrice: number;
    bestIncome: number;
    gasSpent: number;
    bestTotal: number;
    bestSource: Edge | undefined;
    checkLine: number;
    constructor(t: RToken);
    cleanTmpData(): void;
    getNeibour(e?: Edge): Vertice | undefined;
    getOutputEdges(): Edge[];
    getInputEdges(): Edge[];
}
export declare class Graph {
    vertices: Vertice[];
    edges: Edge[];
    private tokens;
    constructor(pools: RPool[], start: RToken, baseTokenOrNetworks: RToken | NetworkInfo[], gasPriceSingleNetwork?: number, minPriceLiquidity?: number, priceLogging?: boolean);
    getVert(t: RToken): Vertice | undefined;
    cleanTmpData(): void;
    setPricesStable(from: Vertice, price: number, networks: NetworkInfo[], minLiquidity?: number, logging?: boolean): void;
    setPricesStableInsideChain(from: Vertice, price: number, gasPrice: number): void;
    setPrices(from: Vertice, price: number, gasPrice: number): void;
    getOrCreateVertice(token: RToken): Vertice;
    findBestPathExactIn(from: RToken, to: RToken, amountIn: number): {
        path: Edge[];
        output: number;
        gasSpent: number;
        totalOutput: number;
    } | undefined;
    findBestPathExactOut(from: RToken, to: RToken, amountOut: number): {
        path: Edge[];
        input: number;
        gasSpent: number;
        totalInput: number;
    } | undefined;
    addPath(from: Vertice | undefined, to: Vertice | undefined, path: Edge[]): void;
    getPrimaryPriceForPath(from: Vertice, path: Edge[]): number;
    findBestRouteExactIn(from: RToken, to: RToken, amountIn: bigint | number, mode: number | number[]): MultiRoute;
    findBestRouteExactOut(from: RToken, to: RToken, amountOut: number, mode: number | number[]): MultiRoute;
    getRouteLegs(from: Vertice, to: Vertice): {
        legs: RouteLeg[];
        gasSpent: number;
        topologyWasChanged: boolean;
    };
    edgeFrom(e: Edge): {
        vert: Vertice;
        amount: number;
    } | undefined;
    removeEdgesWithLowFlow(minFraction: number): number;
    updateLegsAmountOut(legs: RouteLeg[], amountIn: number): number;
    calcLegsAmountIn(legs: RouteLeg[], amountOut: number): number;
    cleanTopology(from: Vertice, to: Vertice): {
        vertices: Vertice[];
        topologyWasChanged: boolean;
    };
    removeDeadEnds(verts: Vertice[]): void;
    removeWeakestEdge(verts: Vertice[]): void;
    topologySort(from: Vertice, to: Vertice): {
        status: number;
        vertices: Vertice[];
    };
}
//# sourceMappingURL=Graph.d.ts.map