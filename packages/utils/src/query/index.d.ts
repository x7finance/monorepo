/**
 * TanStack Query configuration presets
 *
 * These presets provide consistent caching behavior across the application.
 * Import into your app and use with QueryClient configuration.
 */
/**
 * Time constants in milliseconds for cache configuration
 */
export declare const TIME: {
    readonly SECOND: 1000;
    readonly MINUTE: number;
    readonly HOUR: number;
    readonly DAY: number;
};
/**
 * Cache tier configurations for TanStack Query
 *
 * STATIC: Token metadata, contract addresses - rarely changes
 * SEMI_STATIC: Prices, pool configs - changes occasionally
 * DYNAMIC: Balances, market data - changes frequently
 * REALTIME: Active swaps, tx status - needs immediate updates
 */
export declare const CACHE_TIERS: {
    readonly STATIC: {
        readonly staleTime: number;
        readonly gcTime: number;
    };
    readonly SEMI_STATIC: {
        readonly staleTime: number;
        readonly gcTime: number;
        readonly refetchOnWindowFocus: true;
    };
    readonly DYNAMIC: {
        readonly staleTime: number;
        readonly gcTime: number;
    };
    readonly REALTIME: {
        readonly staleTime: 0;
        readonly gcTime: number;
        readonly refetchOnWindowFocus: true;
    };
};
export type CacheTier = keyof typeof CACHE_TIERS;
/**
 * Default query client options
 */
export declare const DEFAULT_QUERY_OPTIONS: {
    readonly queries: {
        readonly staleTime: number;
        readonly gcTime: number;
        readonly retry: 2;
        readonly refetchOnWindowFocus: false;
    };
    readonly mutations: {
        readonly retry: 0;
    };
};
//# sourceMappingURL=index.d.ts.map