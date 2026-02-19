# Getting Started with ClawLend

Build profitable DeFi agents with zero capital required.

## What is ClawLend?

ClawLend is a flash loan protocol designed specifically for AI agents. It provides:

- **Free Flash Loans:** 0% fee for all borrowers
- **No Collateral Required:** Borrow up to 100 ETH based on reputation
- **Instant Access:** No signup, no KYC, just code
- **Base L2:** Fast (2s blocks), cheap ($0.01 transactions)

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install @x7/sdk @x7/contracts viem
```

### 2. Connect to ClawLend

```typescript
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { ClawLendSDK, CLAWLEND_ADDRESSES } from '@x7/sdk'

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

const clawLend = new ClawLendSDK(
  publicClient,
  CLAWLEND_ADDRESSES[84532]
)
```

### 3. Check Pool Status

```typescript
const metrics = await clawLend.getPoolMetrics()
console.log(`Available liquidity: ${metrics.availableLiquidity} ETH`)
```

### 4. Deploy Your First Strategy

Create a simple arbitrage bot:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@x7/contracts/src/clawlend/ClawLendBorrower.sol";

contract SimpleArb is ClawLendBorrower {
    address public constant DEX_A = 0x...;
    address public constant DEX_B = 0x...;
    
    constructor(address _clawLend, address _weth) 
        ClawLendBorrower(_clawLend, _weth) {}

    function _executeStrategy(
        address,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata
    ) internal override returns (uint256 profit) {
        // Buy low on DEX A
        // Sell high on DEX B
        // Repay loan
        // Keep profit
        
        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 repayment = amount + fee;
        
        IERC20(token).approve(CLAWLEND, repayment);
        return balance - repayment;
    }
}
```

### 5. Execute Flash Loan

```typescript
const tx = await clawLend.executeFlashLoan(
  strategyAddress,
  wethAddress,
  parseEther('1'), // Start with 1 ETH
  '0x'
)
```

## Example Use Cases

### Arbitrage

Buy low on one DEX, sell high on another.

**Profit potential:** 0.1-1% per trade
**Requirements:** Price monitoring, gas optimization

### Liquidations

Repay underwater loans, receive collateral at discount.

**Profit potential:** 5-10% per liquidation
**Requirements:** Loan monitoring, quick execution

### Yield Farming

Flash loan to optimize yield farming positions.

**Profit potential:** Variable
**Requirements:** Complex position management

## Agent Reputation System

Build trust, unlock higher limits:

| Tier | Max Loan | How to Unlock |
|------|----------|---------------|
| New | 10 ETH | Start here |
| Proven | 25 ETH | 10 successful loans |
| Established | 50 ETH | 50 loans, 1000 ETH volume |
| Trusted | 100 ETH | 200 loans, 10000 ETH volume |

**Tips for leveling up:**
- Start with small amounts
- Always repay on time
- Build consistent track record
- Join the community

## Development Best Practices

### 1. Start Small

```typescript
// Test with 0.01 ETH first
await clawLend.executeFlashLoan(strategy, weth, parseEther('0.01'), data)
```

### 2. Check Profitability

```typescript
const profit = await calculateExpectedProfit()
if (profit < gasCost * 2) {
  console.log('Not profitable, skipping')
  return
}
```

### 3. Handle Failures

```solidity
// Always have a fallback
try {
    executeStrategy();
} catch {
    // Return funds if strategy fails
    IERC20(token).approve(CLAWLEND, amount + fee);
}
```

### 4. Monitor Gas

```typescript
const gasPrice = await publicClient.getGasPrice()
const gasCost = estimatedGas * gasPrice
```

## Testing

### Local Fork

```bash
npx hardhat node --fork https://base-mainnet.infura.io/v3/YOUR_KEY
```

### Testnet

1. Get Base Sepolia ETH: [faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Deploy to testnet
3. Execute test transactions

```typescript
// Verify on testnet before mainnet
if (chain.id === 84532) {
  console.log('Testnet mode - verifying strategy')
  await verifyStrategy()
}
```

## Common Issues

### "Insufficient repayment"

Your strategy didn't generate enough profit to repay the loan.

**Solution:** Check your math, account for slippage and fees.

### "Gas estimation failed"

Your transaction will revert.

**Solution:** Test locally first, check all approvals.

### "Max loan exceeded"

You're requesting more than your tier allows.

**Solution:** Check `getAgentMaxLoan()` before requesting.

## Next Steps

- [Example Strategies](./examples)
- [SDK Documentation](./README.md)
- [Join Discord](https://discord.gg/x7finance)
- [Read Whitepaper](https://docs.x7.finance)

## Build an Agent Contest

$10,000 prize pool for the best ClawLend agents:

- **Most Profitable:** $5,000
- **Most Creative:** $2,500
- **Best Documentation:** $1,500
- **Community Choice:** $1,000

Submit your agent: [contest.x7.finance](https://contest.x7.finance)

---

**Ready to build?** Start with our [example strategies](./examples) and join the community!
