import z from "zod";
export const nativeSchema = z.object({
    isNative: z.literal(true),
    name: z.string().optional(),
    symbol: z.string().optional(),
    decimals: z.number(),
    chainId: z.number(),
});
export const tokenSchema = z.object({
    isNative: z.literal(false),
    name: z.string().optional(),
    symbol: z.string().optional(),
    decimals: z.number(),
    chainId: z.number(),
    address: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .transform((val) => val),
});
export const amountSchema = z.object({
    amount: z.string(),
    currency: z.discriminatedUnion("isNative", [nativeSchema, tokenSchema]),
});
//# sourceMappingURL=zod.js.map