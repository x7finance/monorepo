# X7 Finance - Agent Instructions

## Non-Negotiable

1. **Run `bun run checks` before completing any task**
2. **Use `??` for defaults, never `||`** (preserves falsy values like `0`, `false`, `""`)
3. **Check `packages/` for existing code before creating new**
4. **All packages build to `dist/` with `tsc`**

## Monorepo Layout

```
apps/org/          → Main X7 website (Next.js 16)
packages/          → Shared packages (@x7/*)
tooling/           → Shared configs (tsconfig)
scripts/           → Repo scripts (bun run)
prds/              → Product requirement docs
```

## Quick Rules

- **Deps**: `workspace:*` for internal, root catalog for shared
- **Console**: Only `console.error` / `console.warn` (no `.log`)
- **Naming**: kebab-case files, PascalCase components, camelCase functions
- **Build**: Every package needs `bun run build` → `dist/`

## Commands

```bash
bun run checks      # format + lint + typecheck (REQUIRED)
bun run build       # Build all
bun run dev         # Start dev (builds packages, then starts apps/org via portless)
```

## Local HTTPS (Portless)

Dev uses [portless](https://github.com/nicolo-ribaudo/portless) for HTTPS with stable `.localhost` URLs:

| App | URL |
|-----|-----|
| org | `https://x7-org.localhost:1355` |
| assets | `https://x7-assets.localhost:1355` |

Setup (one-time):
1. `bun add -g portless`
2. `brew install mkcert && mkcert -install`
3. Regenerate cert: `mkcert -cert-file ~/.portless/server.pem -key-file ~/.portless/server-key.pem "localhost" "*.localhost" "x7-org.localhost" "x7-assets.localhost"`
4. `cp "$(mkcert -CAROOT)/rootCA.pem" ~/.portless/ca.pem`
5. `portless proxy start --https`

Then `bun run dev` starts the app behind portless automatically.

## Stack

Next.js 16, TypeScript, Viem/Wagmi, Tailwind CSS v4, Bun, Turborepo, tsc
