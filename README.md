<p align="center">
  <img src="https://assets.x7finance.org/images/svgs/x7.svg" alt="X7 Finance" width="180" height="180" />
</p>

<h1 align="center">X7 Finance</h1>

<p align="center">
  <strong>Trust No One. Trust Code. Long Live DeFi.</strong>
</p>

<p align="center">
  A decentralized exchange with innovative lending protocols.<br/>
  Built on Base. Powered by community.
</p>

<p align="center">
  <a href="https://www.x7finance.org" target="_blank"><img src="https://img.shields.io/badge/Website-00A3E0?style=for-the-badge&logo=safari&logoColor=white" alt="Website" /></a>
  <a href="https://discord.gg/x7finance" target="_blank"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://x.com/X7_Finance" target="_blank"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>
  <a href="https://t.me/X7portal" target="_blank"><img src="https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Viem-000000?style=flat-square&logo=ethereum&logoColor=white" alt="Viem" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Turbo-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turbo" />
  <img src="https://img.shields.io/badge/Base-0052FF?style=flat-square&logo=base&logoColor=white" alt="Base" />
</p>

<hr />

> **New here?** Jump to [Quick Start](#quick-start) to get running in 5 minutes.
>
> This repo is optimized for **AI-assisted development** with `.ruler/` context files.

## What is X7?

🌟 **Initial Leveraged Liquidity (ILLs)** — Anyone with a good idea can raise 10-1000X ETH to launch projects on Xchange, our world-class DEX.

✅ **Risk-Free Lending** — LPs earn yield without principal risk through our novel lending design.

✅ **Complete Decentralization** — DAO governance with IPFS-hosted frontend for censorship resistance.

✅ **Community-Driven** — Our Telegram and Discord are entirely community-run.

> _"X7's founding team believes that capital should be available to those with great ideas and that the unflinching reliability of code and distributed consensus can provide capital while eliminating significant downside risk."_
>
> _— X7DAO Founding Team_

## What's Inside?

This Turborepo monorepo contains everything that powers the X7 Finance ecosystem:

```
x7finance/
├── apps/
│   └── org/              # Main X7 website (Next.js 16)
├── packages/
│   ├── contracts/        # Smart contract ABIs and types
│   ├── sdk/              # JavaScript SDK for Xchange
│   ├── router/           # Swap routing logic
│   ├── smart-order-router/  # Advanced order routing
│   ├── tines/            # Pool math and calculations
│   ├── ui/               # Shared UI component library
│   ├── token-lists/      # Token list management
│   └── utils/            # Shared utilities
└── tooling/
    └── typescript/       # Shared TypeScript configurations
```

### Apps

| App | Description | URL |
|-----|-------------|-----|
| **`org`** | Main X7 Finance website | [x7finance.org](https://www.x7finance.org) |

### Packages

| Package | Description | External |
|---------|-------------|----------|
| **`@x7/contracts`** | Smart contract ABIs and TypeScript types | ✅ |
| **`@x7/sdk`** | Core SDK for interacting with Xchange | ✅ |
| **`@x7/router`** | Liquidity routing across pools | ✅ |
| **`@x7/smart-order-router`** | Intelligent order routing with price optimization | ✅ |
| **`@x7/tines`** | Mathematical utilities for AMM pools | ✅ |
| **`@x7/ui`** | React component library (shadcn/ui + Tailwind) | — |
| **`@x7/token-lists`** | Token list specification and validation | ✅ |
| **`@x7/utils`** | Shared utilities (math, formatting, etc.) | ✅ |
| **`@x7/icons`** | Icon components | — |
| **`@x7/css`** | Tailwind CSS utilities and design tokens | — |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 22+ (see `.nvmrc`)
- [Bun](https://bun.sh/) 1.3+
- [Git](https://git-scm.com/)
- [mkcert](https://github.com/FiloSottile/mkcert) — trusted local HTTPS certificates
- [portless](https://github.com/nicolo-ribaudo/portless) — stable HTTPS dev URLs (no port numbers)

### 1. Clone & Install

```bash
git clone https://github.com/x7finance/monorepo.git
cd monorepo
bun install
```

### 2. Environment Setup

```bash
# Copy example environment
cp .env.example .env.local
cd apps/org && cp .env.example .env.local && cd ../..

# Edit .env files with your keys:
# - Wallet Connect Project ID
# - RPC endpoints (Alchemy/Infura)
# - Optional: DocSearch credentials
```

### 3. HTTPS Setup (One-Time)

Dev uses [portless](https://github.com/nicolo-ribaudo/portless) (≥ 0.15, needs Node 24+) to eliminate port conflicts and provide stable HTTPS dev URLs.

```bash
# Install portless
bun add -g portless

# Add its local CA to your system trust store
# (first run also does this automatically)
portless trust

# Safari only: sync the routes into /etc/hosts
portless hosts sync
```

Portless generates its own CA and auto-starts the HTTPS proxy on first run — no `mkcert` needed.

### 4. Start Development

```bash
bun run dev
```

Visit [https://x7-org.dev](https://x7-org.dev)

| App | URL |
|-----|-----|
| **org** | `https://x7-org.dev` |
| **assets** | `https://x7-assets.dev` |

> **Note:** `bun run dev` builds all packages first, then starts the org app behind portless. Portless assigns a random port and routes traffic through its HTTPS proxy. Use `portless list` to see active routes and `portless doctor` to check health.

## Development Workflow

### Common Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build all packages and apps
bun run build:setup      # Build packages only (faster for dev)

# Code Quality
bun run checks           # Run format + lint + typecheck
bun run lint             # Lint with OxLint
bun run lint:fix         # Auto-fix linting issues
bun run typecheck        # TypeScript type checking
bun run format           # Check formatting
bun run format:fix       # Auto-fix formatting

# Maintenance
bun run clean            # Clean build artifacts
bun run clean:all        # Deep clean (includes node_modules)
```

### Package Scripts

Each package supports:

```bash
bun run build     # Build to dist/
bun run dev       # Watch mode (tsc --watch)
bun run typecheck # Type check only
cd packages/sdk && bun run build  # Build specific package
```

## Project Structure

### Monorepo Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      apps/org                           │
│                  (Next.js 16 Website)                   │
├─────────────────────────────────────────────────────────┤
│  @x7/ui  │  @x7/sdk  │  @x7/contracts  │  @x7/router   │
├─────────────────────────────────────────────────────────┤
│  @x7/utils  │  @x7/css  │  @x7/icons  │  @x7/tines    │
└─────────────────────────────────────────────────────────┘
```

### Key Technologies

| Category | Stack |
|----------|-------|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript 5.8 (native preview) |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Blockchain** | Viem, Wagmi |
| **Build** | Turborepo, tsc |
| **Linting** | OxLint |

## Smart Contracts

X7 Finance operates across multiple chains with battle-tested contracts:

### Base Mainnet

| Contract | Address | Purpose |
|----------|---------|---------|
| X7 Lending Pool | `0x4eE199B7DFED6B96402623BdEcf2B1ae2f3750Dd` | Primary lending liquidity |
| WETH | `0x4200000000000000000000000000000000000006` | Wrapped ETH |

### Integration

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { X7LendingPoolV2 } from '@x7/contracts'

const client = createPublicClient({
  chain: base,
  transport: http()
})

// Read lending pool data
const liquidity = await client.readContract({
  address: X7LendingPoolV2.address,
  abi: X7LendingPoolV2.abi,
  functionName: 'getLiquidity'
})
```

## Contributing

We welcome contributions from the community!

### Quick Start

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Before Submitting

```bash
bun run checks  # MUST pass before PR
```

### Standards

- Follow the coding standards in `.ruler/`
- Use `??` for defaults (not `||`)
- No `console.log` in production code
- All packages must build to `dist/`

## AI-Assisted Development

This repository includes `.ruler/` configuration for AI agents:

```bash
# Apply ruler configuration to all supported agents
bun run ruler:apply
```

Supported agents: Claude, Cursor, Cline, Copilot, Codeium

## Community

- 💬 [Telegram](https://t.me/X7portal) — Community chat
- 🐦 [Twitter/X](https://x.com/X7_Finance) — Announcements
- 🎮 [Discord](https://discord.gg/x7finance) — Developer discussions
- 🌐 [Website](https://www.x7finance.org) — Official site

## License

This repository uses open-source libraries. See individual package `LICENSE` files for details.

Special acknowledgment to the SushiSwap team whose code has inspired many lines in this monorepo.

---

<p align="center">
  <strong>Trust no one. Trust code. Long live DeFi.</strong>
</p>
