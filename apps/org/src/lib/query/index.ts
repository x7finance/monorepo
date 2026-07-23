// Re-export shared query presets from @x7/utils
export { TIME, CACHE_TIERS, DEFAULT_QUERY_OPTIONS } from "@x7/utils"
export type { CacheTier } from "@x7/utils"

// App-specific error handlers
export {
  handleQueryError,
  handleMutationError,
  createQueryCacheConfig,
  createMutationCacheConfig,
} from "./error-handler"
