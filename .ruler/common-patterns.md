# Common Code Patterns - X7 Finance

## React Component

```typescript
// components/token-card.tsx (kebab-case!)
import { type FC } from "react"
import { cn } from "@x7/css"

interface TokenCardProps {
  className?: string
  token: Token
  balance?: bigint
}

export const TokenCard: FC<TokenCardProps> = ({ 
  className, 
  token, 
  balance 
}) => {
  const formattedBalance = balance ?? 0n  // Use nullish coalescing
  
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <span>{token.symbol}</span>
    </div>
  )
}
```

## Viem Contract Read

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { X7LendingPoolV2 } from '@x7/contracts'

const client = createPublicClient({
  chain: base,
  transport: http()
})

// Read contract data
const liquidity = await client.readContract({
  address: X7LendingPoolV2.address,
  abi: X7LendingPoolV2.abi,
  functionName: 'getLiquidity'
})
```

## Wagmi Hook Pattern

```typescript
"use client"

import { useAccount, useWriteContract } from 'wagmi'
import { X7LendingPoolV2 } from '@x7/contracts'

export function useDeposit() {
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  
  const deposit = async (amount: bigint) => {
    if (!address) throw new Error("Wallet not connected")
    
    return writeContract({
      address: X7LendingPoolV2.address,
      abi: X7LendingPoolV2.abi,
      functionName: 'deposit',
      args: [amount]
    })
  }
  
  return { deposit, isPending }
}
```

## Server/Client Boundary

```typescript
// Server Component
export default async function PoolPage() {
  // Server-side data fetching
  return <PoolClient />
}

// Client Component
"use client"
export function PoolClient() {
  const { address } = useAccount()
  // Interactive wallet code
}
```

## Error Handling

```typescript
try {
  const result = await contractCall()
  return { success: true, data: result }
} catch (error) {
  console.error("Contract call failed:", error)
  return { 
    success: false, 
    error: error instanceof Error ? error.message : "Unknown error" 
  }
}
```

## BigInt Formatting

```typescript
import { formatUnits, parseUnits } from 'viem'

// Display to user
const displayAmount = formatUnits(amount, 18)  // "1.5"

// Parse user input
const parsedAmount = parseUnits("1.5", 18)  // 1500000000000000000n

// Nullish handling
const safeAmount = amount ?? 0n
```

## Loading State Pattern

```tsx
<LoadingContent 
  loading={isLoading} 
  error={error}
  loadingText="Fetching pool data..."
>
  {data && <PoolData data={data} />}
</LoadingContent>
```

## Package Export Pattern

```typescript
// packages/sdk/src/index.ts
export * from "./core"
export * from "./router"
export * from "./v2"
export * from "./v3"
```

## Environment Variables

```typescript
// Use t3-env for type-safe env vars
import { env } from "@/env"

const apiKey = env.NEXT_PUBLIC_ALCHEMY_ID  // ✅ Type-safe
```
