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
