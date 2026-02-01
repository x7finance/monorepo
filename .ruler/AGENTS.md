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
