// Pioneer image utilities - hydration-safe randomization
// Total pioneers in the collection: 4473 (0001-4473)

const TOTAL_PIONEERS = 4473
const PIONEER_URL_BASE = "https://assets.x7finance.org/pioneers"

/**
 * Seeded random number generator for SSR consistency.
 * Uses a simple hash function to ensure the same seed always produces
 * the same result (prevents hydration mismatches).
 */
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483647 // Normalize to 0-1
}

/**
 * Format a pioneer number to 4-digit zero-padded string.
 */
function formatPioneerNumber(n: number): string {
  return Math.max(1, Math.min(TOTAL_PIONEERS, n)).toString().padStart(4, "0")
}

/**
 * Get a deterministic pioneer number based on a seed string.
 * Use this for SSR-safe rendering (same seed = same image).
 */
export function getSeededPioneerNumber(seed: string): string {
  const randomValue = seededRandom(seed)
  const pioneerNumber = Math.floor(randomValue * TOTAL_PIONEERS) + 1
  return formatPioneerNumber(pioneerNumber)
}

// Counter for generating unique pioneer numbers within a single render pass
let _pioneerCounter = 0

/**
 * Get a pseudo-random pioneer number.
 * Uses a seeded counter to produce varied but deterministic results
 * that are safe for server components and SSR.
 */
export function getRandomPioneerNumber(): string {
  _pioneerCounter++
  const seed = `pioneer-${_pioneerCounter}`
  return getSeededPioneerNumber(seed)
}

/**
 * Build the full URL for a pioneer image.
 */
export function getPioneerUrl(number: string | number): string {
  const formatted =
    typeof number === "number" ? formatPioneerNumber(number) : number
  return `${PIONEER_URL_BASE}/${formatted}.png`
}

/**
 * Get a deterministic pioneer URL based on a seed.
 * SSR-safe - will always return the same URL for the same seed.
 */
export function getSeededPioneerUrl(seed: string): string {
  return getPioneerUrl(getSeededPioneerNumber(seed))
}

/**
 * Get a pseudo-random pioneer URL.
 * Uses deterministic seeding - safe for server components.
 */
export function getRandomPioneerUrl(): string {
  return getPioneerUrl(getRandomPioneerNumber())
}

/**
 * Predefined curated pioneers for consistent high-quality displays.
 * These are known good pioneers that display well in the UI.
 */
export const CURATED_PIONEERS = [
  "0001",
  "0042",
  "0088",
  "0134",
  "0200",
  "0256",
  "0300",
  "0450",
  "0500",
  "0600",
  "0750",
  "0800",
  "0900",
  "1000",
  "1200",
  "1500",
  "2000",
  "2500",
  "3000",
  "3500",
  "4000",
  "4473",
] as const

/**
 * Get a curated pioneer by index (cycles through curated list).
 * SSR-safe and deterministic.
 */
export function getCuratedPioneerNumber(index: number): string {
  return CURATED_PIONEERS[index % CURATED_PIONEERS.length]!
}

/**
 * Get the URL for a curated pioneer by index.
 */
export function getCuratedPioneerUrl(index: number): string {
  return getPioneerUrl(getCuratedPioneerNumber(index))
}
