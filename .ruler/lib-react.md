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
