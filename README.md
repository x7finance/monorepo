<p style="padding-top: 30px;" align="center">
  <img src="https://assets.x7finance.org/images/svgs/x7.svg" alt="X7 Banner Logo" />
</p>

<br />
<div align="center"><strong>X7 Finance</strong></div>
<div align="center">Trust No One. Trust Code. Long Live DeFi</div>
<div align="center">A completely decentralized exchange with innovative lending protocols.</div>
<br />
<div align="center">
<a href="https://www.x7finance.org">Website</a> 
<span> · </span>
<a href="https://t.me/X7portal">Telegram</a> 
<span> · </span>
<a href="https://x.com/X7_Finance">Twitter X</a>
<span> · </span>
<a href="https://discord.gg/x7finance">Discord</a>
</div>

# Welcome to X7 Finance

X7 Finance is an ecosystem of innovative smart contracts that democratizes access to capital. Our platform provides visionary developers with leveraged seed capital (Initial Liquidity Loans or ILLs) without lenders incurring the risk of losing principal. This breakthrough has profound implications for DeFi as a whole!

## What is X7?

🌟 **Leveraged Initial Liquidity**: Anyone with a good idea can raise 10-1000X the amount of ETH in their wallet to launch projects on Xchange, our world-class DEX.

✅ **Decentralized Exchange**: Our completely decentralized exchange enables permissionless trading with high liquidity and low fees.

✅ **Lending Protocol**: A risk-free lending system that allows liquidity providers to earn returns while developers get access to capital.

✅ **DAO Governance**: A novel governance structure coupled with IPFS website ensures complete decentralization and censorship-resistance.

✅ **Community-Driven**: Our Telegram and Twitter are community-run, in the spirit of true decentralization.

> _"X7's founding team believes that capital should be available to those with great ideas and that the unflinching reliability of code and distributed consensus can provide capital while eliminating significant downside risk."_
>
> _- X7DAO Founding Team_

## How It Works

**Initial Leveraged Liquidity DEX**

- Developers can borrow initial liquidity to launch projects for a small fee
- Projects can launch with more liquidity, making them more attractive to investors
- Your borrowing capacity scales with your initial capital

**Decentralized Lending Pool**

- Users can loan ETH to the Lending Pool risk-free
- Lock your ETH for a specific period and earn rewards
- All profits from the DEX go back into the ecosystem (tokens, lending pool, future development)

🥇 We will consider this project a success once it captures at least 1% of the $100b daily trading volume on ETH.

## Repository Structure

This monorepo contains all the code for the X7 Finance ecosystem:

```text
x7finance/
├── apps/                  # Applications
│   ├── org/               # Main X7 Finance website
│   └── assets/            # Asset hosting service
├── packages/              # Shared libraries and utilities
│   ├── contracts/         # Smart contract implementations
│   ├── sdk/               # JavaScript SDK for interacting with X7
│   ├── ui/                # Shared UI components
│   ├── router/            # Swap routing logic
│   ├── smart-order-router/ # Smart order routing system
│   ├── token-lists/       # Token list management
│   └── utils/             # Shared utility functions
└── tooling/               # Development and build tools
```

## Getting Started

To start developing on the X7 Finance platform, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) version 22.x
- [PNPM](https://pnpm.io/) version 10.x

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/x7finance/monorepo.git
   cd monorepo
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build required packages:

   ```bash
   pnpm run build:setup
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

### Environment Setup

The project requires various environment variables for proper functionality. To set them up:

1. Copy the example environment files:

   ```bash
   cp .env.example .env.local && cd apps/org && cp .env.example .env.local && cd ../..
   ```

2. Edit the `.env.local` files to add your API keys and configuration values.

Key environment variables include:

- RPC endpoints for various chains
- Wallet Connect Project ID
- DocSearch configuration
- Alchemy API keys

## Development Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run linting on the codebase
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Check formatting
- `pnpm format:fix` - Fix formatting issues
- `pnpm test` - Run tests
- `pnpm e2e` - Run end-to-end tests
- `pnpm clean:all` - Clean all build artifacts and dependencies

## Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows our coding standards and passes all tests.

## Technologies

This project utilizes several modern technologies:

- [Turborepo](https://turbo.build/repo) - Monorepo build system
- [Next.js](https://nextjs.org/docs) - React framework for the web app
- [React 19](https://react.dev/) - UI library
- [Viem](https://viem.sh/docs/getting-started) - Type-safe interface for EVM blockchains
- [Wagmi](https://wagmi.sh/react/getting-started) - React hooks for Ethereum
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Markdoc](https://markdoc.io) - Documentation format
- [DocSearch](https://docsearch.algolia.com) - Documentation search

## License

This monorepo uses many open-source libraries and source code. For simplicity, we have consolidated licenses in the licenses folders of each package. Special acknowledgment to the SushiSwap team whose code has inspired many lines in this monorepo.

## Community and Support

- [Telegram](https://t.me/X7portal) - Join our community chat
- [Twitter X](https://x.com/X7_Finance) - Follow us for updates
- [Discord](https://discord.gg/x7finance) - Developer discussions
- [Website](https://www.x7finance.org) - Official website

<br />

_**Trust no one. Trust code. Long live DeFi.**_
