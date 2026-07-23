"use client"

// Catches errors thrown by the root layout itself (route-level error.tsx files
// cannot). Renders its own <html>/<body> and avoids app providers/CSS, since
// those may be exactly what failed — inline styles guarantee it always renders.

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#09090b",
          color: "#e4e4e7",
        }}
      >
        <main style={{ maxWidth: 480, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#a1a1aa", marginBottom: 24 }}>
            {error.message || "An unexpected error occurred."}
            {error.digest ? ` (ref: ${error.digest})` : ""}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid #3f3f46",
              background: "#18181b",
              color: "#e4e4e7",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
