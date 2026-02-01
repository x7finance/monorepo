/* oxlint-disable react-hooks/exhaustive-deps */
/* oxlint-disable @typescript-eslint/no-unused-vars */
/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { useCallback, useEffect, useState } from "react"
import { isAddress } from "viem"

import { ChainId, ChainNameKey } from "@x7/utils"

import tokenLogoLookup from "../constants/tokenLogoLookup"

// Direct mapping for X7 tokens to ensure they always show up
const X7_TOKEN_LOGOS: Record<string, string> = {
  // Case-insensitive lookup by lowercasing the addresses
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

// Track failed sources to avoid retrying them
const BAD_SRCS: Record<string, true> = {}

function parseLogoSources(uris: string[]) {
  const urls: string[] = []
  uris.forEach((uri) => urls.push(...uriToHttp(uri)))
  return urls
}

function prioritizeLogoSources(uris: string[]) {
  const parsedUris = uris.map((uri) => uriToHttp(uri)).flat(1)
  const preferredUris: string[] = []

  let coingeckoUrl: string | undefined = undefined

  parsedUris.forEach((uri) => {
    if (uri.startsWith("https://assets.coingecko")) {
      if (!coingeckoUrl) {
        coingeckoUrl = uri.replace(/small|thumb/g, "large")
      }
    } else {
      preferredUris.push(uri)
    }
  })

  return coingeckoUrl ? [...preferredUris, coingeckoUrl] : preferredUris
}

/**
 * Gets the appropriate logo URL for a token
 */
function getTokenLogoURL(
  address?: `0x${string}` | null,
  chainId?: ChainId | null,
  isNative?: boolean,
  backupImg?: string | null
): string | undefined {
  // 1. Handle native tokens (ETH, MATIC, BNB)
  if (chainId && isNative) {
    return getNativeLogoURI(chainId)
  }

  // 2. Check if it's an X7 token (highest priority)
  if (address) {
    const lowerCaseAddress = address.toLowerCase()
    if (X7_TOKEN_LOGOS[lowerCaseAddress]) {
      return X7_TOKEN_LOGOS[lowerCaseAddress]
    }
  }

  // 3. Try Uniswap assets repository
  if (address && isAddress(address)) {
    const networkName = chainId
      ? ChainNameKey[chainId as keyof typeof ChainNameKey]
      : "ethereum"

    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }

  // 4. Use backup image if provided
  return backupImg ?? undefined
}

/**
 * Hook for getting and managing token logo sources with fallbacks
 */
export function useAssetLogoSource(
  address?: `0x${string}` | null,
  chainId?: ChainId | null,
  isNative?: boolean,
  backupImg?: string | null
): [string | undefined, () => void] {
  const [current, setCurrent] = useState<string | undefined>(
    getTokenLogoURL(address, chainId, isNative, backupImg)
  )
  const [fallbackSrcs, setFallbackSrcs] = useState<string[]>([])

  // Update sources when inputs change
  useEffect(() => {
    if (current) {
      delete BAD_SRCS[current]
    }

    // Get primary URL
    const primaryUrl = getTokenLogoURL(address, chainId, isNative, backupImg)
    setCurrent(primaryUrl)

    // Setup fallbacks
    const fallbacks: string[] = []

    // For non-X7 tokens, add some common fallbacks
    if (address && !X7_TOKEN_LOGOS[address.toLowerCase()]) {
      // Try Trust Wallet assets
      fallbacks.push(
        `https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/${address}/logo.png`
      )

      // Try CoinGecko if not an X7 token
      if (address) {
        fallbacks.push(
          `https://assets.coingecko.com/coins/images/large/${address.toLowerCase()}.png`
        )
      }
    }

    if (backupImg) {
      fallbacks.push(backupImg)
    }

    setFallbackSrcs(fallbacks)
  }, [address, chainId, isNative, backupImg])

  // Handle fallback when an image fails to load
  const nextSrc = useCallback(() => {
    if (current) {
      BAD_SRCS[current] = true
    }

    // Try X7 tokens first (again, just to be sure)
    if (address) {
      const x7Logo = X7_TOKEN_LOGOS[address.toLowerCase()]
      if (x7Logo && !BAD_SRCS[x7Logo]) {
        setCurrent(x7Logo)
        return
      }
    }

    // Try fallbacks
    const next = fallbackSrcs.find((src) => !BAD_SRCS[src])
    setCurrent(next)
  }, [current, fallbackSrcs, address])

  return [current, nextSrc]
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
  } catch (error) {
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
