import type { ChainId } from "../chain";
export declare class AddressMapper {
    static generate(addressLists: (Record<number, string[]> | Record<number, string>)[]): Record<string, {
        chainId: ChainId;
        tokenAddress: string;
    }[]>;
    static merge(...addressLists: Record<number, `0x${string}`>[]): Record<number, string[]>;
}
//# sourceMappingURL=AddressMapper.d.ts.map