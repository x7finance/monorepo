# Next.js 16 App Router

## Core Principles

- Server Components by default
- Minimize `'use client'` directives
- Use Suspense for async operations
- Keep pages as static as possible

## Server/Client Boundaries

**Server Component (default):**
```typescript
// app/pool/page.tsx
export default async function PoolPage() {
  // Runs on server
  return (
    <div>
      <h1>Lending Pool</h1>
      <PoolClient />
    </div>
  )
}
```

**Client Component (minimal):**
```typescript
"use client"
// app/pool/_components/pool-client.tsx

import { useAccount } from 'wagmi'

export function PoolClient() {
  const { address } = useAccount()
  // Wallet interaction
}
```

## Common Errors

**"Functions cannot be passed"**
```typescript
// ❌ Wrong
<ClientComponent onClick={handleClick} />

// ✅ Correct
// Pass string identifier, map in client
<ClientComponent action="deposit" />
```

**"Event handlers cannot be passed"**
```typescript
// ❌ Wrong - event handlers must be in client components
<button onClick={handleClick}>Click</button>

// ✅ Correct
"use client"
export function Button() {
  return <button onClick={handleClick}>Click</button>
}
```

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Pages | `page.tsx` | `app/pool/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx` |
| Loading | `loading.tsx` | `app/pool/loading.tsx` |
| Error | `error.tsx` | `app/pool/error.tsx` |
| Components | kebab-case | `_components/pool-card.tsx` |

## Data Fetching

```typescript
// Server Component - fetch directly
export default async function Page() {
  const pools = await fetchPools()  // Server-side
  return <PoolList pools={pools} />
}
```

## Metadata

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'X7 Finance - DeFi Lending',
  description: 'Trust No One. Trust Code.',
}
```
