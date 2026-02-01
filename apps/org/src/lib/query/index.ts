export { TIME, CACHE_TIERS, DEFAULT_QUERY_OPTIONS } from "./presets";
export type { CacheTier } from "./presets";
export {
  handleQueryError,
  handleMutationError,
  createQueryCacheConfig,
  createMutationCacheConfig,
} from "./error-handler";
