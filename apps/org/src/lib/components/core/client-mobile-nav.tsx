"use client"

import dynamic from "next/dynamic"

const MobileNavigation = dynamic(
  () =>
    import("./mobile-navigation").then((mod) => ({
      default: mod.MobileNavigation,
    })),
  { ssr: false }
)

export function ClientMobileNavigation({
  className,
}: {
  className?: string
}): React.JSX.Element | null {
  return <MobileNavigation className={className} />
}
