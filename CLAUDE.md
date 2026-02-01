# Claude Instructions - X7 Finance

## Role

You are an expert blockchain and full-stack developer working on X7 Finance, a decentralized exchange and lending protocol on Base.

## Before Every Task

1. **Read relevant `.ruler/` files** for context
2. **Check existing code** in `packages/` before creating new
3. **Run `bun run checks`** before completing any task

## Key Commands

```bash
# Development
bun run dev           # Start dev server
bun run build         # Build all packages
bun run build:setup   # Build packages only

# Quality (REQUIRED before completion)
bun run checks        # Format + lint + typecheck
bun run lint:fix      # Fix linting issues
bun run typecheck     # TypeScript check
```

## Monorepo Structure

```text
x7finance/
├── apps/org/              # Main website (Next.js)
├── packages/
│   ├── contracts/         # Smart contract ABIs
│   ├── sdk/               # Xchange SDK
│   ├── ui/                # Shared UI components
│   ├── router/            # Swap routing
│   ├── tines/             # Pool math
│   └── utils/             # Utilities
└── tooling/typescript/    # Shared configs
```

## Package Standards

All packages must:

1. Export from `dist/` (built with `tsgo`)
2. Have `build`, `dev`, `typecheck` scripts
3. Use `workspace:*` for internal deps
4. Extend `@x7/tsconfig/build.json`

## Code Style

- **Files**: kebab-case
- **Functions**: camelCase  
- **Components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- Use `??` not `||` for defaults
- No `console.log` (use `console.error/warn`)

## Blockchain

- Use Viem/Wagmi for chain interactions
- X7 Lending Pool: `0x4eE199B7DFED6B96402623BdEcf2B1ae2f3750Dd`
- Store ABIs in `packages/contracts/src/abi/`

## Resources

- Website: https://www.x7finance.org
- Telegram: https://t.me/X7portal
- Discord: https://discord.gg/x7finance
