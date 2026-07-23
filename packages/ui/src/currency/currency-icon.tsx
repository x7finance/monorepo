/* oxlint-disable @typescript-eslint/no-unnecessary-condition */

"use client"

import type { ImageProps } from "next/image"
import Image from "next/image"
import { useMemo, useState } from "react"

import type { Currency } from "@x7/utils"
import { Chain } from "@x7/utils"

import { useAssetLogoSource } from "../hooks/use-token-logo-source"
import { LinkExternal } from "../link"

function djb2(str: string) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i) /* hash * 33 + c */
  }
  return hash
}

function hashStringToColor(str: string) {
  const hash = djb2(str)
  const r = (hash & 0xff0000) >> 16
  const g = (hash & 0x00ff00) >> 8
  const b = hash & 0x0000ff
  return `#${`0${r.toString(16)}`.substr(-2)}${`0${g.toString(16)}`.substr(
    -2
  )}${`0${b.toString(16)}`.substr(-2)}`
}

export interface CurrencyIconProps extends Omit<ImageProps, "src" | "alt"> {
  currency: Currency
  disableLink?: boolean
}

export const CurrencyIcon = ({
  currency,
  disableLink = true,
  width = 20,
  height = 20,
  ...rest
}: CurrencyIconProps) => {
  // Handle both Native and Token types - check if it's a Token type with address property
  const tokenAddress =
    "isToken" in currency && currency.isToken
      ? (currency as { address: `0x${string}` }).address
      : undefined

  const [imgSrc, nextSrc] = useAssetLogoSource(
    tokenAddress,
    currency.chainId,
    currency.isNative,
    ""
  )

  const [error, setError] = useState(false)

  // Generate fallback background color based on currency details
  const fallbackColor = useMemo(
    () => hashStringToColor(`${currency.symbol} ${currency.name}`),
    [currency.symbol, currency.name]
  )

  // Handle image loading error
  const handleError = () => {
    setError(true)
    if (nextSrc) nextSrc()
  }

  // Convert width/height to numbers with default value
  const widthPx = typeof width === "number" ? width : Number(width || 20)
  const heightPx = typeof height === "number" ? height : Number(height || 20)

  const fallbackElement = (
    <div
      style={{
        width: widthPx,
        height: heightPx,
        backgroundColor: fallbackColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: `${Math.max(12, widthPx / 1.8)}px`,
        fontWeight: "bold",
        overflow: "hidden",
      }}
    >
      {currency.symbol?.substring(0, 2)}
    </div>
  )

  // If we have no image source or encountered an error, show fallback
  if (!imgSrc || error) {
    if (disableLink) {
      return fallbackElement
    }

    return (
      <LinkExternal
        href={Chain.tokenUrl(currency.chainId, currency.wrapped.address)}
      >
        {fallbackElement}
      </LinkExternal>
    )
  }

  // Render actual image if we have a valid source
  const imageElement = (
    <div
      style={{
        width: widthPx,
        height: heightPx,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src={imgSrc}
        alt={`${currency.symbol ?? "Token"} logo`}
        width={widthPx}
        height={heightPx}
        onError={handleError}
        style={{
          borderRadius: "50%",
          objectFit: "contain",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        {...rest}
      />
    </div>
  )

  if (disableLink) {
    return imageElement
  }

  return (
    <LinkExternal
      href={Chain.tokenUrl(currency.chainId, currency.wrapped.address)}
    >
      {imageElement}
    </LinkExternal>
  )
}
