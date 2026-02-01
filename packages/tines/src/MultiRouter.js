import { Graph, NoWayMultiRoute, RouteStatus } from "./Graph";
import { setTokenId } from "./PrimaryPools";
// Assumes route is a single path
function calcPriceImactWithoutFee(route) {
    if (route.primaryPrice === undefined || route.swapPrice === undefined) {
        return undefined;
    }
    else {
        let oneMinusCombinedFee = 1;
        route.legs.forEach((l) => {
            oneMinusCombinedFee *= 1 - l.poolFee;
        });
        //const combinedFee = 1-oneMinusCombinedFee
        return Math.max(0, 1 - route.swapPrice / route.primaryPrice / oneMinusCombinedFee);
    }
}
const defaultFlowNumber = 12;
const maxFlowNumber = 100;
function calcBestFlowNumber(bestSingleRoute, amountIn, gasPriceIn) {
    if (typeof amountIn === "bigint") {
        amountIn = parseInt(amountIn.toString());
    }
    const priceImpact = calcPriceImactWithoutFee(bestSingleRoute);
    if (!priceImpact)
        return defaultFlowNumber;
    const bestFlowAmount = Math.sqrt((bestSingleRoute.gasSpent * (gasPriceIn ?? 0) * amountIn) / priceImpact);
    const bestFlowNumber = Math.round(amountIn / bestFlowAmount);
    if (!Number.isFinite(bestFlowNumber))
        return maxFlowNumber;
    const realFlowNumber = Math.max(1, Math.min(bestFlowNumber, maxFlowNumber));
    return realFlowNumber;
}
function getBetterRouteExactIn(route1, route2) {
    if (route1.status === RouteStatus.NoWay)
        return route2;
    if (route2.status === RouteStatus.NoWay)
        return route1;
    if (route1.status === RouteStatus.Partial &&
        route2.status === RouteStatus.Success)
        return route2;
    if (route2.status === RouteStatus.Partial &&
        route1.status === RouteStatus.Success)
        return route1;
    return route1.totalAmountOut > route2.totalAmountOut ? route1 : route2;
}
function deduplicatePools(pools) {
    const poolMap = new Map();
    pools.forEach((p) => {
        const chId0 = p.token0.chainId ?? 0;
        const chId1 = p.token1.chainId ?? 0;
        const chainInfo = chId0 < chId1 ? `_${chId0}_${chId1}` : `_${chId1}_${chId0}`;
        poolMap.set(p.address + chainInfo, p);
    });
    return Array.from(poolMap.values());
}
export function findMultiRouteExactIn(from, to, amountIn, pools, baseTokenOrNetworks, gasPrice, flows) {
    pools = deduplicatePools(pools);
    checkChainId(pools, baseTokenOrNetworks);
    setTokenId(from, to);
    if (from.tokenId === to.tokenId)
        return NoWayMultiRoute(from, to);
    const g = new Graph(pools, from, baseTokenOrNetworks, gasPrice);
    if (flows !== undefined)
        return g.findBestRouteExactIn(from, to, amountIn, flows);
    const outSingle = g.findBestRouteExactIn(from, to, amountIn, 1);
    // Possible optimization of timing
    // if (g.findBestPathExactIn(from, to, amountIn/100 + 10_000, 0)?.gasSpent === 0) return outSingle
    g.cleanTmpData();
    const bestFlowNumber = calcBestFlowNumber(outSingle, amountIn, g.getVert(from)?.gasPrice);
    if (bestFlowNumber === 1)
        return outSingle;
    const outMulti = g.findBestRouteExactIn(from, to, amountIn, bestFlowNumber);
    return getBetterRouteExactIn(outSingle, outMulti);
}
function getBetterRouteExactOut(route1, route2, gasPrice) {
    if (route1.status === RouteStatus.NoWay)
        return route2;
    if (route2.status === RouteStatus.NoWay)
        return route1;
    if (route1.status === RouteStatus.Partial &&
        route2.status === RouteStatus.Success)
        return route2;
    if (route2.status === RouteStatus.Partial &&
        route1.status === RouteStatus.Success)
        return route1;
    const totalAmountIn1 = route1.amountIn + route1.gasSpent * gasPrice;
    const totalAmountIn2 = route2.amountIn + route2.gasSpent * gasPrice;
    return totalAmountIn1 < totalAmountIn2 ? route1 : route2;
}
export function findMultiRouteExactOut(from, to, amountOut, pools, baseTokenOrNetworks, gasPrice, flows) {
    pools = deduplicatePools(pools);
    checkChainId(pools, baseTokenOrNetworks);
    setTokenId(from, to);
    if (from.tokenId === to.tokenId)
        return NoWayMultiRoute(from, to);
    if (typeof amountOut === "bigint") {
        amountOut = parseInt(amountOut.toString());
    }
    const g = new Graph(pools, from, baseTokenOrNetworks, gasPrice);
    if (flows !== undefined)
        return g.findBestRouteExactOut(from, to, amountOut, flows);
    const inSingle = g.findBestRouteExactOut(from, to, amountOut, 1);
    // Possible optimization of timing
    // if (g.findBestPathExactOut(from, to, amountOut/100 + 10_000, 0)?.gasSpent === 0) return inSingle
    g.cleanTmpData();
    const fromV = g.getVert(from);
    const bestFlowNumber = calcBestFlowNumber(inSingle, inSingle.amountIn, fromV?.gasPrice);
    if (bestFlowNumber === 1)
        return inSingle;
    const inMulti = g.findBestRouteExactOut(from, to, amountOut, bestFlowNumber);
    return getBetterRouteExactOut(inSingle, inMulti, fromV?.gasPrice ?? 0);
}
export function findSingleRouteExactIn(from, to, amountIn, pools, baseTokenOrNetworks, gasPrice) {
    pools = deduplicatePools(pools);
    checkChainId(pools, baseTokenOrNetworks);
    setTokenId(from, to);
    if (from.tokenId === to.tokenId)
        return NoWayMultiRoute(from, to);
    const g = new Graph(pools, from, baseTokenOrNetworks, gasPrice);
    const out = g.findBestRouteExactIn(from, to, amountIn, 1);
    return out;
}
export function findSingleRouteExactOut(from, to, amountOut, pools, baseTokenOrNetworks, gasPrice) {
    pools = deduplicatePools(pools);
    checkChainId(pools, baseTokenOrNetworks);
    setTokenId(from, to);
    if (from.tokenId === to.tokenId)
        return NoWayMultiRoute(from, to);
    const g = new Graph(pools, from, baseTokenOrNetworks, gasPrice);
    if (typeof amountOut === "bigint") {
        amountOut = parseInt(amountOut.toString());
    }
    const out = g.findBestRouteExactOut(from, to, amountOut, 1);
    return out;
}
export function calcTokenPrices(pools, baseToken, minPriceLiquidity = 0, priceLogging = false) {
    setTokenId(baseToken);
    const g = new Graph(pools, baseToken, baseToken, 0, minPriceLiquidity, priceLogging);
    const res = new Map();
    g.vertices.forEach((v) => {
        if (v.price !== 0)
            res.set(v.token, v.price);
    });
    return res;
}
// Checks correctness of ChainId of each token in each network
// Could be avoided for speed of work, but helps to find out difficult to catch bugs
function checkChainId(pools, baseTokenOrNetworks) {
    if (Array.isArray(baseTokenOrNetworks)) {
        baseTokenOrNetworks.forEach((n) => {
            if (n.chainId !== n.baseToken.chainId) {
                throw new Error(`Chain '${n.chainId}' has baseToken with '${n.baseToken.chainId}' that are not the same`);
            }
        });
    }
    const chainIds = Array.isArray(baseTokenOrNetworks)
        ? baseTokenOrNetworks.map((n) => n.chainId)
        : [baseTokenOrNetworks.chainId];
    const chainIdSet = new Set(chainIds);
    const checkToken = (t) => {
        if (!chainIdSet.has(t.chainId)) {
            throw new Error(`Token ${t.name}/${t.address} chainId='${t.chainId}' is not in list of possible chains: [${chainIds.join(", ")}]`);
        }
    };
    pools.forEach((p) => {
        checkToken(p.token0);
        checkToken(p.token1);
    });
}
//# sourceMappingURL=MultiRouter.js.map