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
