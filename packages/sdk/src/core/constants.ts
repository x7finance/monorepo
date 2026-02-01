import { Percent } from "@x7/utils";

// exports for external consumption
export type BigintIsh = string | number | bigint;

export const FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const MINIMUM_LIQUIDITY = BigInt(1000);
export const NEGATIVE_ONE = BigInt(-1);
export const ZERO = BigInt(0);
export const ONE = BigInt(1);
export const FIVE = BigInt(5);
export const _997 = BigInt(997);
export const _1000 = BigInt(1000);
export const BASIS_POINTS = BigInt(10000);

export const Q96 = BigInt(2) ** BigInt(96);
export const Q192 = Q96 ** BigInt(2);
export const MAX_PRICE_IMPACT_PERCENT = new Percent(1 / 2);
