import { RPool } from "./PrimaryPools";
export class BridgeUnlimited extends RPool {
    constructor(address, token0, token1, fee, swapGasCost = 150_000) {
        super(address, token0, token1, fee, -1n, -1n, 0, swapGasCost);
    }
    calcOutByIn(amountIn, _direction) {
        return { out: amountIn * (1 - this.fee), gasSpent: this.swapGasCost };
    }
    calcInByOut(amountOut, _direction) {
        return { inp: amountOut / (1 - this.fee), gasSpent: this.swapGasCost };
    }
    calcCurrentPriceWithoutFee(_direction) {
        return 1;
    }
    alwaysAppropriateForPricing() {
        return true;
    }
}
//# sourceMappingURL=BridgeBidirectionalUnlimited.js.map