# React & Next.js 16

## Core Principles

- Server Components by default — minimize `"use client"`
- Direct hook imports: `import { useState } from "react"` (never `React.useState`)
- Suspense for async, keep pages as static as possible

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Pages | `page.tsx` | `app/pool/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx` |
| Components | kebab-case | `_components/pool-card.tsx` |

## Server/Client Boundary

```tsx
// Server Component (default) — app/pool/page.tsx
export default async function PoolPage() {
  const pools = await fetchPools()
  return <PoolClient pools={pools} />
}

// Client Component — _components/pool-client.tsx
"use client"
import { useAccount } from "wagmi"
export function PoolClient() {
  const { address } = useAccount()
}
```

Functions and event handlers cannot be passed from server → client components.

## Event Handlers

Prefix with `handle`: `handleClick`, `handleSubmit`, `handleTokenSelect`.

## Memoization

Only for expensive calculations: `useMemo(() => tokens.sort(...), [tokens])`.
