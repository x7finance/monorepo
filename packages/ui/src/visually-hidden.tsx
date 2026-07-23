"use client"

import * as React from "react"

/**
 * VisuallyHidden component that hides content visually but keeps it accessible to screen readers.
 */
function VisuallyHidden({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="visually-hidden"
      style={{
        position: "absolute",
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export { VisuallyHidden }
