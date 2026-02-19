# ClawLend SDK Documentation

## Overview

ClawLend is an AI-native flash loan protocol built on X7 Finance. It enables AI agents and developers to execute DeFi strategies with zero upfront capital.

**Key Features:**
- **Zero-Fee Flash Loans:** Free flash loans for all agents
- **Tiered Access:** Unlock higher borrowing limits based on reputation
- **ERC4626 Vault:** Standard yield-bearing liquidity pool
- **Base L2:** Fast, cheap transactions with Coinbase backing

## Installation

```bash
npm install @x7/sdk @x7/contracts viem
```

## Quick Start

```typescript
import { createPublicClient, createWalletClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { ClawLendSDK, CLAWLEND_ADDRESSES } from '@x7/sdk'

// Setup clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
  account: privateKeyToAccount('0x...')
})

// Initialize SDK
const clawLend = new ClawLendSDK(
  publicClient,
  CLAWLEND_ADDRESSES[84532], // Base Sepolia
  walletClient
)
```

## Reading Pool Data

### Get Pool Metrics

```typescript
const metrics = await clawLend.getPoolMetrics()
console.log(`
  TVL: ${metrics.totalAssets} ETH
  Available: ${metrics.availableLiquidity} ETH
  Utilization: ${await clawLend.getUtilization()}%
  APY: ${await clawLend.calculateAPY()}%
`)
```

### Get Agent Stats

```typescript
const stats = await clawLend.getAgentStats(agentAddress)
console.log(`
  Tier: ${stats.tier} (${['New', 'Proven', 'Established', 'Trusted'][stats.tier]})
  Loans: ${stats.loanCount}
  Volume: ${stats.totalVolume} ETH
`)

const maxLoan = await clawLend.getAgentMaxLoan(agentAddress)
console.log(`Max Loan: ${maxLoan} ETH`)
```

## Providing Liquidity

### Deposit

```typescript
import { parseEther } from 'viem'

// Approve WETH first
// ... approval transaction ...

const tx = await clawLend.deposit(
  parseEther('1'), // 1 ETH worth of WETH
  userAddress
)
console.log(`Deposited: ${tx}`)
```

### Withdraw

```typescript
const tx = await clawLend.withdraw(
  parseEther('1'), // Withdraw 1 ETH worth
  userAddress,     // Send to
  userAddress      // Owner
)
```

### Redeem Shares

```typescript
const tx = await clawLend.redeem(
  parseEther('100'), // 100 shares
  userAddress,
  userAddress
)
```

## Executing Flash Loans

### Basic Flash Loan

```typescript
// Deploy a borrower contract first
const tx = await clawLend.executeFlashLoan(
  borrowerContractAddress, // Your strategy contract
  wethAddress,
  parseEther('10'), // Borrow 10 ETH
  '0x' // Strategy-specific data
)
```

### Building a Borrower Contract

Your borrower contract must inherit from `ClawLendBorrower`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@x7/contracts/src/clawlend/ClawLendBorrower.sol";

contract MyStrategy is ClawLendBorrower {
    constructor(address _clawLend, address _weth) 
        ClawLendBorrower(_clawLend, _weth) {}

    function _executeStrategy(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) internal override returns (uint256 profit) {
        // Your strategy logic here
        // 1. Use borrowed funds
        // 2. Generate profit
        // 3. Return profit amount
        
        // Must have enough to repay amount + fee
        uint256 repayment = amount + fee;
        require(
            IERC20(token).balanceOf(address(this)) >= repayment,
            "Insufficient repayment"
        );
        
        // Approve ClawLend to pull repayment
        IERC20(token).approve(CLAWLEND, repayment);
        
        profit = IERC20(token).balanceOf(address(this)) - repayment;
        return profit;
    }
}
```

## Agent Tiers

| Tier | Name | Max Loan | Requirements |
|------|------|----------|--------------|
| 0 | New | 10 ETH | 0-9 loans |
| 1 | Proven | 25 ETH | 10+ loans |
| 2 | Established | 50 ETH | 50+ loans, 1000+ ETH volume |
| 3 | Trusted | 100 ETH | 200+ loans, 10000+ ETH volume |

**Benefits:**
- Higher borrowing limits
- Priority access during high demand
- Reduced fees on premium features (future)

## Example Strategies

### 1. Base Arbitrage Agent

See: `examples/BaseArbitrageAgent.sol`

Arbitrage between two DEXs:
```typescript
// Setup arbitrage parameters
const params = {
  dexA: uniswapRouter,
  dexB: sushiswapRouter,
  tokenA: x7Token,
  tokenB: weth,
  swapDataA: encodeSwap(...),
  swapDataB: encodeSwap(...),
  minProfit: parseEther('0.01')
}

// Execute via flash loan
await clawLend.executeFlashLoan(
  arbitrageAgent,
  weth,
  parseEther('50'),
  encodeAbiParameters([...], [params])
)
```

### 2. Liquidation Hunter

See: `examples/LiquidationHunter.sol`

Liquidate underwater loans:
```typescript
const params = {
  lendingProtocol: x7Lending,
  user: underwaterBorrower,
  collateralToken: x7Token,
  loanToken: weth,
  dexRouter: uniswapRouter,
  minReward: parseEther('0.05'),
  liquidationData: encodeLiquidation(...),
  swapData: encodeSwap(...)
}
```

### 3. X7 Ecosystem Arbitrage

See: `examples/X7EcosystemArbitrage.sol`

Arbitrage X7 tokens between Xchange and external DEXs.

## Network Addresses

### Base Sepolia (Testnet)

| Contract | Address |
|----------|---------|
| ClawLendPool | `0x...` (TBD) |
| ClawLendFlashLoan | `0x...` (TBD) |
| WETH | `0x4200000000000000000000000000000000000006` |

### Base Mainnet

| Contract | Address |
|----------|---------|
| ClawLendPool | `0x...` (TBD) |
| ClawLendFlashLoan | `0x...` (TBD) |
| WETH | `0x4200000000000000000000000000000000000006` |

## Security Considerations

### For Strategy Developers

1. **Always repay:** Flash loans must be repaid + fee in same transaction
2. **Slippage protection:** Always set minimum output amounts
3. **Gas optimization:** Account for gas costs in profit calculations
4. **Reentrancy:** Be aware of reentrancy risks in callback functions
5. **Price oracles:** Don't rely on single DEX for pricing

### For Liquidity Providers

1. **ERC4626 standard:** ClawLendPool follows ERC4626 for compatibility
2. **Withdrawal buffer:** Small buffer prevents flash loan DOS
3. **Authorized borrowers:** Only approved flash loan contracts can borrow
4. **Pause functionality:** Emergency pause in case of issues

## Testing

### Local Testing

```bash
cd packages/contracts
npx hardhat test
```

### Testnet Testing

1. Get Base Sepolia ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Deploy your strategy contract
3. Execute test flash loan

```typescript
// Test with small amount first
await clawLend.executeFlashLoan(
  strategyAddress,
  weth,
  parseEther('0.01'), // Start small
  testData
)
```

## Resources

- [ClawLend Whitepaper](https://docs.x7.finance/clawlend)
- [Example Strategies](https://github.com/x7finance/monorepo/tree/main/packages/contracts/src/clawlend/examples)
- [Discord #clawlend-dev](https://discord.gg/x7finance)

## Support

For questions and support:
- Discord: #clawlend-dev channel
- Twitter: @X7_Finance
- Email: dev@x7.finance
