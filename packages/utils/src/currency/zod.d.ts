import z from "zod";
export declare const nativeSchema: z.ZodObject<{
    isNative: z.ZodLiteral<true>;
    name: z.ZodOptional<z.ZodString>;
    symbol: z.ZodOptional<z.ZodString>;
    decimals: z.ZodNumber;
    chainId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    isNative: true;
    name?: string | undefined;
    symbol?: string | undefined;
    decimals: number;
    chainId: number;
}, {
    isNative: true;
    name?: string | undefined;
    symbol?: string | undefined;
    decimals: number;
    chainId: number;
}>;
export declare const tokenSchema: z.ZodObject<{
    isNative: z.ZodLiteral<false>;
    name: z.ZodOptional<z.ZodString>;
    symbol: z.ZodOptional<z.ZodString>;
    decimals: z.ZodNumber;
    chainId: z.ZodNumber;
    address: z.ZodEffects<z.ZodString, `0x${string}`, string>;
}, "strip", z.ZodTypeAny, {
    isNative: false;
    name?: string | undefined;
    symbol?: string | undefined;
    decimals: number;
    chainId: number;
    address: `0x${string}`;
}, {
    isNative: false;
    name?: string | undefined;
    symbol?: string | undefined;
    decimals: number;
    chainId: number;
    address: string;
}>;
export declare const amountSchema: z.ZodObject<{
    amount: z.ZodString;
    currency: z.ZodDiscriminatedUnion<"isNative", [z.ZodObject<{
        isNative: z.ZodLiteral<true>;
        name: z.ZodOptional<z.ZodString>;
        symbol: z.ZodOptional<z.ZodString>;
        decimals: z.ZodNumber;
        chainId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        isNative: true;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
    }, {
        isNative: true;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
    }>, z.ZodObject<{
        isNative: z.ZodLiteral<false>;
        name: z.ZodOptional<z.ZodString>;
        symbol: z.ZodOptional<z.ZodString>;
        decimals: z.ZodNumber;
        chainId: z.ZodNumber;
        address: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    }, "strip", z.ZodTypeAny, {
        isNative: false;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
        address: `0x${string}`;
    }, {
        isNative: false;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
        address: string;
    }>]>;
}, "strip", z.ZodTypeAny, {
    amount: string;
    currency: {
        isNative: true;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
    } | {
        isNative: false;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
        address: `0x${string}`;
    };
}, {
    amount: string;
    currency: {
        isNative: true;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
    } | {
        isNative: false;
        name?: string | undefined;
        symbol?: string | undefined;
        decimals: number;
        chainId: number;
        address: string;
    };
}>;
export type SerializedNative = z.infer<typeof nativeSchema>;
export type SerializedToken = z.infer<typeof tokenSchema>;
export type SerializedAmount = z.infer<typeof amountSchema>;
//# sourceMappingURL=zod.d.ts.map