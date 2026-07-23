/**
 * TanStack Query configuration presets
 *
 * These presets provide consistent caching behavior across the application.
 * Import into your app and use with QueryClient configuration.
 */

/**
 * Time constants in milliseconds for cache configuration
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const

/**
 * Cache tier configurations for TanStack Query
 *
 * STATIC: Token metadata, contract addresses - rarely changes
 * SEMI_STATIC: Prices, pool configs - changes occasionally
 * DYNAMIC: Balances, market data - changes frequently
 * REALTIME: Active swaps, tx status - needs immediate updates
 *
 * Note on `refetchOnWindowFocus`: the global default (see
 * DEFAULT_QUERY_OPTIONS below) disables focus-refetch, but SEMI_STATIC and
 * REALTIME intentionally re-enable it per tier. This is deliberate policy:
 * time-sensitive data (prices, live tx/swap status) should refresh when the
 * user returns to the tab. A call site that spreads one of these tiers will
 * therefore override the global `false` — that is expected, not a bug.
 */
export const CACHE_TIERS = {
  STATIC: {
    staleTime: TIME.DAY,
    gcTime: 7 * TIME.DAY,
  },
  SEMI_STATIC: {
    staleTime: 15 * TIME.MINUTE,
    gcTime: TIME.HOUR,
    refetchOnWindowFocus: true,
  },
  DYNAMIC: {
    staleTime: 30 * TIME.SECOND,
    gcTime: 5 * TIME.MINUTE,
  },
  REALTIME: {
    staleTime: 0,
    gcTime: TIME.MINUTE,
    refetchOnWindowFocus: true,
  },
} as const

export type CacheTier = keyof typeof CACHE_TIERS

/**
 * Default query client options
 *
 * `refetchOnWindowFocus` is disabled globally here to avoid a refetch storm on
 * every tab focus. Individual tiers (SEMI_STATIC, REALTIME) may re-enable it
 * for time-sensitive data by spreading the tier into a query's options, which
 * overrides this global default by design.
 */
export const DEFAULT_QUERY_OPTIONS = {
  queries: {
    ...CACHE_TIERS.DYNAMIC,
    retry: 2,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
} as const
