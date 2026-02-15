

<!-- Source: .ruler/AGENTS.md -->

# Agent Instructions - X7 Finance

## Non-Negotiable

1. **Run `bun run checks` before completing any task**
2. **Use `??` for defaults, never `||`** (preserves falsy values)
3. **Check `packages/` for existing code before creating new**
4. **All packages must build to `dist/` with `tsgo`**

## Monorepo Structure

```
x7finance/
├── apps/
│   └── org/              # Main X7 website
├── packages/
│   ├── contracts/        # Smart contract ABIs and types
│   ├── sdk/              # Xchange SDK
│   ├── ui/               # Shared UI components
│   ├── router/           # Swap routing logic
│   ├── tines/            # Pool math utilities
│   ├── utils/            # Shared utilities
│   └── ...
└── tooling/
    └── typescript/       # Shared tsconfig files
```

## Quick Rules

- **Packages**: Use `workspace:*` for internal dependencies
- **Build**: All packages must have `bun run build` → outputs to `dist/`
- **Versions**: Use root catalog for shared dependencies
- **Console**: No `console.log` (use `console.error/warn` only)
- **Naming**: kebab-case for files, camelCase for functions

## Commands

```bash
bun run checks      # Run format, lint, typecheck (REQUIRED)
bun run build       # Build all packages
bun run build:setup # Build packages only (for dev)
bun run dev         # Start development
```

## Key Technologies

- **Framework**: Next.js 16 (apps), TypeScript (packages)
- **Blockchain**: Viem, Wagmi
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun
- **Build System**: Turborepo + tsgo

See other `.ruler/` files for detailed standards.



<!-- Source: .ruler/base-accessibility.md -->

# Accessibility Standards

## Requirements

All UI components must meet WCAG 2.1 AA standards.

## Core Rules

**Semantic HTML:**

```tsx
// ✅ Correct
<button onClick={handleClick}>Submit</button>

// ❌ Incorrect
<div onClick={handleClick}>Submit</div>
```

**ARIA Labels:**

```tsx
// ✅ Correct
<button aria-label="Close dialog">×</button>

// ✅ Correct with visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

**Focus Management:**

- All interactive elements must be keyboard accessible
- Visible focus indicators (no `outline: none` without replacement)
- Focus trap in modals/dialogs

**Color Contrast:**

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18pt+)
- Minimum 3:1 for UI components

**Images:**

```tsx
// ✅ Decorative
<img src="icon.svg" alt="" />

// ✅ Informative
<img src="chart.png" alt="Price chart showing 24h trend" />
```

## Testing

Use axe-core or similar for automated accessibility testing.



<!-- Source: .ruler/base-coding-standards.md -->

# Coding Standards - X7 Finance

## Critical

**Before completing ANY task: `bun run checks`**

## TypeScript Rules

**Types:**

- `interface` for objects, `type` for unions/intersections
- No `any` types (use `unknown` with type guards)
- Explicit return types on exported functions

**Nullish Coalescing:**

```typescript
const count = userCount ?? 10  // ✅ Preserves 0, false, ""
const count = userCount || 10  // ❌ 0 becomes 10
```

**Optional Chaining:**

```typescript
const id = data?.user?.id  // ✅ Safe
const id = data?.user.id   // ❌ Errors if user undefined
```

## Monorepo Package Standards

**Package Structure:**

```json
{
  "name": "@x7/package-name",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsgo",
    "dev": "tsgo --watch",
    "typecheck": "tsgo --noEmit",
    "lint": "oxlint src/"
  }
}
```

**Required in every package:**

- `build` script using `tsgo`
- `exports` pointing to `dist/`
- `files`: `["dist", "src"]`
- `tsconfig.json` extending `@x7/tsconfig/build.json`

## Console Rules

- ❌ `console.log()`, `console.info()`, `console.debug()`
- ✅ `console.error()`, `console.warn()`

## Naming Conventions

- **Files**: kebab-case (`token-list.ts`)
- **Components**: PascalCase (`TokenList`)
- **Functions**: camelCase (`getTokenList`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SUPPLY`)
- **Types/Interfaces**: PascalCase (`TokenListProps`)

## Dependencies

- Use workspace protocol: `"@x7/sdk": "workspace:*"`
- Add shared deps to root catalog
- Pin major versions in packages



<!-- Source: .ruler/brain-module-exports.md -->

# Server/Client Module Exports

## Rule

**NEVER export client-only code from server-only entry points.**

## Problem

```typescript
// ❌ WRONG - index.ts exports both server and client
export { serverFunction } from "./server"
export { useClientHook } from "./client"  // ❌ Breaks server imports
```

## Solution

Use explicit subpath exports:

```typescript
// ✅ CORRECT - package.json exports
{
  "exports": {
    ".": "./dist/index.js",           // Server-safe
    "./client": "./dist/client.js",   // Client-only
    "./server": "./dist/server.js"    // Server-only
  }
}
```

## X7 Package Pattern

```typescript
// packages/sdk/src/index.ts - Server-safe
export * from "./core"
export * from "./constants"
// ❌ NO: export * from "./hooks" (wagmi hooks)

// packages/sdk/src/client.ts - Client-only
"use client"
export * from "./hooks"
export * from "./react"
```

## Usage

```typescript
// Server Component
import { getPoolData } from "@x7/sdk"        // ✅ Safe

// Client Component
import { usePoolData } from "@x7/sdk/client" // ✅ Explicit
```

## Check Before Exporting

Ask: "Could this be imported by a Server Component?"

- Uses `window`? → Client-only
- Uses `document`? → Client-only
- Uses Wagmi/Viem hooks? → Client-only
- Pure data/functions? → Server-safe



<!-- Source: .ruler/brain-prd.md -->

# PRD Standards

## Location

PRDs live in `prds/` at repository root.

## Naming

```text
prds/
├── 2026-01-15-feature-name.md
├── 2026-01-20-another-feature.md
└── README.md
```

## Structure

```markdown
# Feature Name

## Overview
Brief description of the feature.

## Goals
- Goal 1
- Goal 2

## Non-Goals
- Out of scope item 1

## Technical Design
### API Changes
### Database Changes
### UI Changes

## Open Questions
- Question 1?

## Timeline
- Week 1: Implementation
- Week 2: Testing
```

## Requirements

- All user-facing features require a PRD
- Technical decisions documented
- Security considerations noted
- Performance implications considered



<!-- Source: .ruler/brain-scripts.md -->

# Script Standards

## Location

Scripts live in `scripts/` at repository root.

## Categories

```text
scripts/
├── infra/          # Infrastructure (db, deploy)
├── testing/        # Test utilities
├── codegen/        # Code generation
└── utils/          # General utilities
```

## Standards

**TypeScript Scripts:**

```typescript
#!/usr/bin/env bun
import { $ } from "bun"

async function main() {
  // Script logic
}

main().catch(console.error)
```

**Package.json Scripts:**

```json
{
  "scripts": {
    "db:migrate": "bun run --elide-lines=0 scripts/infra/migrate.ts",
    "generate:types": "bun run scripts/codegen/generate-types.ts"
  }
}
```

**Execution:**

- Always use `bun run --elide-lines=0` for scripts
- Scripts should be self-documenting
- Exit with non-zero on failure



<!-- Source: .ruler/common-patterns.md -->

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



<!-- Source: .ruler/lib-blockchain.md -->

# Blockchain Development Standards

## Viem/Wagmi Patterns

**Client Creation:**
```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({
  chain: base,
  transport: http()
})
```

**Contract Interaction:**
```typescript
const { data } = await client.readContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'balanceOf',
  args: [userAddress]
})
```

## X7 Contract Addresses

**Base Mainnet:**
- X7 Lending Pool: `0x4eE199B7DFED6B96402623BdEcf2B1ae2f3750Dd`
- WETH: `0x4200000000000000000000000000000000000006`
- X7DAO: `0x...`

## ABI Management

- Store ABIs in `packages/contracts/src/abi/`
- Export from `packages/contracts/src/index.ts`
- Use typed ABIs with Viem

## Wallet Connection

Use Wagmi hooks:
```typescript
import { useAccount, useWriteContract } from 'wagmi'

const { address } = useAccount()
const { writeContract } = useWriteContract()
```



<!-- Source: .ruler/lib-nextjs.md -->

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



<!-- Source: .ruler/lib-react.md -->

# React Best Practices

## Core Principles

- Server Components by default in Next.js App Router
- Minimize `'use client'` directives
- Use React 19 features (useActionState, useFormStatus)
- Import hooks directly (never namespace imports)

## React Hook Imports

**NEVER** use namespace imports for React hooks.

```typescript
// ❌ WRONG
import * as React from 'react'
const [count, setCount] = React.useState(0)

// ✅ CORRECT
import { useState } from 'react'
const [count, setCount] = useState(0)
```

## Client Components

```typescript
"use client"  // Only when needed

import { useAccount } from 'wagmi'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  
  return (
    <button>
      {isConnected ? truncateAddress(address) : "Connect"}
    </button>
  )
}
```

## Form Handling

```typescript
"use client"

import { useState } from 'react'

export function DepositForm() {
  const [amount, setAmount] = useState("")
  const { deposit } = useDeposit()
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await deposit(parseUnits(amount, 18))
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
      />
      <button type="submit">Deposit</button>
    </form>
  )
}
```

## Memoization

```typescript
import { useMemo } from 'react'

// Memoize expensive calculations
const sortedTokens = useMemo(() => {
  return tokens.sort((a, b) => b.balance - a.balance)
}, [tokens])
```

## Event Handlers

Prefix with `handle`:

```typescript
const handleClick = () => { }
const handleSubmit = () => { }
const handleTokenSelect = (token: Token) => { }
```



<!-- Source: .ruler/lib-tailwindcss.md -->

# Tailwind CSS v4 Standards

## Configuration

Tailwind v4 uses CSS-based configuration in `packages/css/src/index.ts`:

```typescript
import { cn } from "@x7/css"

// Use cn() for conditional classes
const className = cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)
```

## Class Ordering

1. Layout (display, position, flex/grid)
2. Sizing (width, height)
3. Spacing (margin, padding)
4. Visual (background, border, shadow)
5. Typography (font, text)
6. Interactive (hover, focus, disabled)

## Component Patterns

**Base + Variants with cva:**

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3"
      }
    }
  }
)
```

## Design Tokens

Use CSS variables defined in `@x7/css`:

- `--color-primary`
- `--color-secondary`
- `--radius-lg`
- etc.
