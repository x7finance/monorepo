import { useCallback, useEffect, useMemo, useState } from "react"
import { getAddress, isAddress } from "viem"

import { ChainId, ChainNameKey } from "@x7/utils"

// Direct mapping for X7 tokens to ensure they always show up.
// Keyed by lowercased address for case-insensitive lookup.
const X7_TOKEN_LOGOS: Record<string, string> = {
  "0x70008f18fc58928dce982b0a69c2c21ff80dca54":
    "https://assets.x7finance.org/images/tokens/x7r.png",
  "0x7105e64bf67eca3ae9b123f0e5ca2b83b2ef2da0":
    "https://assets.x7finance.org/images/tokens/x7dao.png",
  "0x7101a9392eac53b01e7c07ca3baca945a56ee105":
    "https://assets.x7finance.org/images/tokens/x7101.png",
  "0x7102dc82ef61bfb0410b1b1bf8ea74575bf0a105":
    "https://assets.x7finance.org/images/tokens/x7102.png",
  "0x7103ebdbf1f89be2d53eff9b3cf996c9e775c105":
    "https://assets.x7finance.org/images/tokens/x7103.png",
  "0x7104d1f179cc9cc7fb5c79be6da846e3fbc4c105":
    "https://assets.x7finance.org/images/tokens/x7104.png",
  "0x7105faa4a26ed1c67b8b2b41bec98f06ee21d105":
    "https://assets.x7finance.org/images/tokens/x7105.png",
  "0x7d000a1b9439740692f8942a296e1810955f5000":
    "https://assets.x7finance.org/images/tokens/x7d.png",
}

// Trust Wallet blockchain folder names. These differ from ChainNameKey
// (e.g. BSC is "smartchain"), so keep a dedicated mapping.
const TRUSTWALLET_CHAIN: Partial<Record<ChainId, string>> = {
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.BSC]: "smartchain",
  [ChainId.POLYGON]: "polygon",
  [ChainId.OPTIMISM]: "optimism",
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.BASE]: "base",
}

/**
 * Builds an ordered, de-duplicated list of candidate logo URLs for a token,
 * most-likely-correct first. The consumer walks this list, advancing to the
 * next source whenever an image fails to load.
 */
function buildLogoSources(
  address?: `0x${string}` | null,
  chainId?: ChainId | null,
  isNative?: boolean,
  backupImg?: string | null
): string[] {
  const out: string[] = []
  const push = (uri?: string | null) => {
    if (!uri) return
    for (const http of uriToHttp(uri)) {
      if (!out.includes(http)) out.push(http)
    }
  }

  // Native currency (ETH, MATIC, BNB, …)
  if (chainId && isNative) {
    push(getNativeLogoURI(chainId))
    push(backupImg)
    return out
  }

  if (address && isAddress(address)) {
    const checksum = getAddress(address)

    // 1. X7 tokens — curated, always available
    push(X7_TOKEN_LOGOS[address.toLowerCase()])

    // 2. Caller-provided image (e.g. a token-list logoURI)
    push(backupImg)

    // 3. Uniswap assets repository (requires checksummed address)
    const uniChain = chainId
      ? ChainNameKey[chainId as keyof typeof ChainNameKey]
      : "ethereum"
    push(
      `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${uniChain}/assets/${checksum}/logo.png`
    )

    // 4. Trust Wallet assets (requires checksummed address + its own folder)
    const twChain = chainId ? TRUSTWALLET_CHAIN[chainId] : "ethereum"
    if (twChain) {
      push(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${twChain}/assets/${checksum}/logo.png`
      )
    }

    return out
  }

  push(backupImg)
  return out
}

/**
 * Hook for resolving a token logo with graceful fallbacks. Returns the current
 * source and a `nextSrc` callback to advance past a source that failed to load.
 * When every source is exhausted the current value is `undefined`, signalling
 * the consumer to render its own placeholder.
 */
export function useAssetLogoSource(
  address?: `0x${string}` | null,
  chainId?: ChainId | null,
  isNative?: boolean,
  backupImg?: string | null
): [string | undefined, () => void] {
  const sources = useMemo(
    () => buildLogoSources(address, chainId, isNative, backupImg),
    [address, chainId, isNative, backupImg]
  )

  const [index, setIndex] = useState(0)

  // Restart the fallback walk whenever the candidate list changes.
  useEffect(() => {
    setIndex(0)
  }, [sources])

  const nextSrc = useCallback(() => {
    setIndex((i) => i + 1)
  }, [])

  return [sources[index], nextSrc]
}

/**
 * Converts a given URI to fetchable HTTP URLs. Handles various protocols including IPFS, IPNS, HTTP, HTTPS, Arweave, and data URIs.
 * @param {string} uri - The URI to convert to a fetchable HTTP URL.
 * @returns {string[]} An array of HTTP URLs corresponding to the input URI.
 */
function uriToHttp(uri: string): string[] {
  try {
    const url = new URL(uri)
    const protocol = url.protocol.slice(0, -1).toLowerCase() // Removes the ':' from protocol

    switch (protocol) {
      case "data":
      case "https":
        return [uri]

      case "http":
        return [uri.replace("http", "https"), uri]

      case "ipfs":
        return convertIpfsOrIpnsUrl("ipfs", uri)

      case "ipns":
        return convertIpfsOrIpnsUrl("ipns", uri)

      case "ar":
        return [`https://arweave.net/${url.pathname}`]

      default:
        return []
    }
  } catch {
    console.error("Invalid URI:", uri)
    return []
  }
}

/**
 * Helper function to convert IPFS or IPNS URIs to their corresponding HTTP URLs.
 * @param {'ipfs' | 'ipns'} type - The type of the URI, either 'ipfs' or 'ipns'.
 * @param {string} uri - The IPFS or IPNS URI to convert.
 * @returns {string[]} An array of HTTP URLs corresponding to the input IPFS or IPNS URI.
 */
function convertIpfsOrIpnsUrl(type: "ipfs" | "ipns", uri: string): string[] {
  const hashOrName = uri.split("/")[2]
  return [
    `https://cloudflare-ipfs.com/${type}/${hashOrName}/`,
    `https://ipfs.io/${type}/${hashOrName}/`,
  ]
}

/**
 * Helper to get native token logos
 */
function getNativeLogoURI(chainId: ChainId = ChainId.ETHEREUM): string {
  switch (chainId) {
    case ChainId.POLYGON:
      return `${process.env.NEXT_PUBLIC_ASSETS_URL}/images/svgs/matic-token-icon.svg`
    case ChainId.BSC:
      return `${process.env.NEXT_PUBLIC_ASSETS_URL}/images/svgs/bnb-logo.svg`
    default:
      return `${process.env.NEXT_PUBLIC_ASSETS_URL}/images/svgs/eth.svg`
  }
}
