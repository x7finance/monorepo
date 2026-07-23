# Common Patterns

## Server/Client Module Exports

Never export client-only code from server-safe entry points. Use subpath exports:

```json
{ "exports": { ".": "./dist/index.js", "./client": "./dist/client.js" } }
```

```ts
// Server-safe: import { getPoolData } from "@x7/sdk"
// Client-only: import { usePoolData } from "@x7/sdk/client"
```

Rule: if it uses `window`, `document`, or Wagmi hooks → client-only export.

## Component Pattern

```tsx
import { type FC } from "react"
import { cn } from "@x7/css"

interface TokenCardProps { className?: string; token: Token }

export const TokenCard: FC<TokenCardProps> = ({ className, token }) => (
  <div className={cn("rounded-lg border p-4", className)}>{token.symbol}</div>
)
```

## BigInt / Contract Values

```ts
import { formatUnits, parseUnits } from "viem"
const display = formatUnits(amount, 18)    // "1.5"
const parsed = parseUnits("1.5", 18)       // 1500000000000000000n
const safe = amount ?? 0n                  // nullish default
```

## Environment Variables

```ts
import { env } from "@/env"  // t3-env, type-safe
```
