# Contributing to X7 Finance

Thank you for your interest in contributing to X7 Finance! We're excited to welcome you to our community. This document provides comprehensive guidelines to help you contribute effectively to our decentralized finance ecosystem.

## 🌟 About X7 Finance

X7 Finance is an ecosystem of innovative smart contracts that democratizes access to capital through leveraged seed capital (Initial Liquidity Loans), a decentralized exchange, and a novel governance structure. Our mission is to create a truly decentralized financial ecosystem where capital is available to those with great ideas.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Development Standards](#development-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

Our community strives to be open, inclusive, and respectful. We expect all contributors to adhere to these principles and treat each other with respect. Harassment, discrimination, or disrespectful behavior of any kind will not be tolerated.

## 🚀 Getting Started

### Repository Structure

The X7 Finance codebase is organized as a monorepo using Turborepo:

```
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

### Prerequisites

- [Node.js](https://nodejs.org/) version 22.x (check `.nvmrc` for the exact version)
- [PNPM](https://pnpm.io/) version 10.x as the package manager

### Setting Up Your Development Environment

1. **Fork the repository**

   Start by forking the repository to your GitHub account.

2. **Clone your fork**

   ```bash
   git clone git@github.com:YOUR_USERNAME/monorepo.git
   cd monorepo
   ```

3. **Add the upstream remote**

   ```bash
   git remote add upstream https://github.com/x7finance/monorepo.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to add necessary configuration values. For local development, the default values in `.env.example` should work, but you might need to obtain API keys for certain services.

6. **Build the local dependency packages**

   ```bash
   pnpm run build:setup
   ```

7. **Start the development server**

   ```bash
   pnpm dev
   ```

## 🔄 Development Workflow

### Branch Strategy

We follow a feature branch workflow:

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

2. Keep your branch updated with the main branch:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

Example:

```
feat(ui): add new button component
```

## 📝 Contribution Guidelines

### Types of Contributions

We welcome various types of contributions, including:

- Bug fixes
- New features
- Documentation improvements
- Performance optimizations
- UI/UX enhancements
- Test coverage improvements

### Feature Requests

**Please ask first before starting work on any significant new features.**

To avoid the disappointment of having your pull request declined after investing effort, we request that contributors create [a feature request](https://github.com/x7finance/monorepo/discussions/new?category=ideas) to first discuss any significant new ideas. This includes things like:

- Adding new utilities or components
- Creating new at-rules or preprocessors
- Making substantial changes to existing functionality

This initial discussion helps ensure your time is spent working on features that align with the project's roadmap and direction.

### Issues

Before submitting a new issue, please:

1. Search for existing issues to avoid duplicates
2. Use the appropriate issue template
3. Include detailed steps to reproduce the issue
4. Specify your environment (browser, OS, Node version, etc.)

## 🔄 Pull Request Process

1. **Create a focused PR**

   - Each PR should address a single concern
   - Keep changes small and manageable

2. **Prepare your PR**

   - Ensure your code passes all tests and linting
   - Include tests for new functionality
   - Update documentation if necessary
   - Reference any related issues using GitHub's syntax (e.g., "Fixes #123")

3. **Submit your PR**

   - Use a clear, descriptive title following our commit conventions
   - Fill out the PR template completely
   - Request a review from appropriate team members

4. **PR Review Process**

   - Address feedback from reviewers
   - Make requested changes and push them to your branch
   - Resolve discussions as they are addressed

5. **Merge**
   - Once approved, a maintainer will merge your PR
   - In some cases, we may ask you to rebase if there are conflicts

## 🛠️ Development Standards

### Coding Standards

Our code formatting rules are defined in [.oxlintrc.json](https://github.com/x7finance/monorepo/blob/main/.oxlintrc.json). We use Oxlint and Prettier to enforce these standards.

To check your code against these standards, run:

```bash
pnpm turbo lint
```

To automatically fix linting issues:

```bash
pnpm lint:fix
```

### TypeScript

We use TypeScript throughout the codebase to ensure type safety. You can check type correctness by running:

```bash
pnpm turbo typecheck
```

### Code Style Best Practices

- Write readable, self-documenting code
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the established patterns in the codebase

## 🧪 Testing

We value well-tested code. When adding new features or fixing bugs, please include appropriate tests.

To run tests:

```bash
pnpm test
```

For end-to-end tests:

```bash
pnpm e2e
```

## 📚 Documentation

Good documentation is crucial for the usability of our project. When adding or modifying features, please:

1. Update any relevant documentation
2. Include JSDoc comments for APIs and functions
3. Provide usage examples for new components or utilities

## 👥 Community

Join our community channels to get help and discuss the project:

- [Telegram](https://t.me/X7portal)
- [Discord](https://discord.gg/x7finance)
- [Twitter](https://x.com/X7_Finance)

## 🙏 Thank You

Your contributions help make X7 Finance better for everyone. We appreciate your time and effort!

---

_**Trust no one. Trust code. Long live DeFi.**_
