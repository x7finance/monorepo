declare module "decimal.js-light" {
  export type Numeric = string | number | Decimal

  export interface Config {
    precision?: number
    rounding?: number
    toExpNeg?: number
    toExpPos?: number
    LN10?: Numeric
  }

  export default class Decimal {
    constructor(n: Numeric)

    static set(config: Config): Decimal
    static clone(config?: Config): typeof Decimal
    static isDecimal(object: unknown): object is Decimal

    static readonly ROUND_UP: 0
    static readonly ROUND_DOWN: 1
    static readonly ROUND_CEIL: 2
    static readonly ROUND_FLOOR: 3
    static readonly ROUND_HALF_UP: 4
    static readonly ROUND_HALF_DOWN: 5
    static readonly ROUND_HALF_EVEN: 6
    static readonly ROUND_HALF_CEIL: 7
    static readonly ROUND_HALF_FLOOR: 8

    static precision: number
    static rounding: number

    readonly d: number[] | null
    readonly e: number
    readonly s: number

    absoluteValue(): Decimal
    abs(): Decimal
    comparedTo(n: Numeric): number
    cmp(n: Numeric): number
    decimalPlaces(): number
    dp(): number
    dividedBy(n: Numeric): Decimal
    div(n: Numeric): Decimal
    dividedToIntegerBy(n: Numeric): Decimal
    divToInt(n: Numeric): Decimal
    equals(n: Numeric): boolean
    eq(n: Numeric): boolean
    floor(): Decimal
    greaterThan(n: Numeric): boolean
    gt(n: Numeric): boolean
    greaterThanOrEqualTo(n: Numeric): boolean
    gte(n: Numeric): boolean
    isInteger(): boolean
    isInt(): boolean
    isNegative(): boolean
    isNeg(): boolean
    isPositive(): boolean
    isPos(): boolean
    isZero(): boolean
    lessThan(n: Numeric): boolean
    lt(n: Numeric): boolean
    lessThanOrEqualTo(n: Numeric): boolean
    lte(n: Numeric): boolean
    logarithm(base?: Numeric): Decimal
    log(base?: Numeric): Decimal
    minus(n: Numeric): Decimal
    sub(n: Numeric): Decimal
    modulo(n: Numeric): Decimal
    mod(n: Numeric): Decimal
    naturalExponential(): Decimal
    exp(): Decimal
    naturalLogarithm(): Decimal
    ln(): Decimal
    negated(): Decimal
    neg(): Decimal
    plus(n: Numeric): Decimal
    add(n: Numeric): Decimal
    precision(includeZeros?: boolean): number
    sd(includeZeros?: boolean): number
    round(): Decimal
    squareRoot(): Decimal
    sqrt(): Decimal
    times(n: Numeric): Decimal
    mul(n: Numeric): Decimal
    toBinary(significantDigits?: number): string
    toDecimalPlaces(dp?: number, rm?: number): Decimal
    toDP(dp?: number, rm?: number): Decimal
    toExponential(dp?: number, rm?: number): string
    toFixed(dp?: number, rm?: number): string
    toFraction(maxDenominator?: Numeric): Decimal[]
    toHexadecimal(significantDigits?: number): string
    toHex(significantDigits?: number): string
    toJSON(): string
    toNearest(n: Numeric, rm?: number): Decimal
    toNumber(): number
    toOctal(significantDigits?: number): string
    toPower(n: Numeric): Decimal
    pow(n: Numeric): Decimal
    toPrecision(sd?: number, rm?: number): string
    toSignificantDigits(sd?: number, rm?: number): Decimal
    toSD(sd?: number, rm?: number): Decimal
    toString(): string
    truncated(): Decimal
    trunc(): Decimal
    valueOf(): string
  }
}
