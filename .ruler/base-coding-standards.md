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
