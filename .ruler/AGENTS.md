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

Dev uses [portless](https://github.com/nicolo-ribaudo/portless) for stable HTTPS dev URLs (no port numbers):

| App | URL |
|-----|-----|
| org | `https://x7-org.dev` |
| assets | `https://x7-assets.dev` |

Setup (one-time), with portless ≥ 0.15:
1. `bun add -g portless` (requires Node 24+)
2. `portless trust` — generates a local CA and adds it to the system trust store (first run does this automatically)
3. On Safari: `portless hosts sync`

Then `bun run dev` starts the app behind portless automatically at the URL above — the proxy auto-starts on first run. Use `portless list` to see active routes, `portless get x7-org` for a service's URL, and `portless doctor` to check health.

## Stack

Next.js 16, TypeScript, Viem/Wagmi, Tailwind CSS v4, Bun, Turborepo, tsc
