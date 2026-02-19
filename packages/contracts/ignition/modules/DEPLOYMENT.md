# ClawLend Testnet Deployment

## Network: Base Sepolia (Chain ID: 84532)

## Prerequisites

1. Set up environment variables:
```bash
export INFURA_API_KEY="your_infura_key"
export PRIVATE_KEY="your_deployer_private_key"
```

2. Ensure deployer wallet has Base Sepolia ETH:
   - Get ETH from Base Sepolia faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Or bridge from Sepolia: https://bridge.base.org/deposit

## Deploy Commands

### Using Hardhat Ignition
```bash
cd packages/contracts
npx hardhat ignition deploy ignition/modules/ClawLendTestnet.js --network baseSepolia
```

### Verify on Basescan
After deployment, verify contracts:
```bash
npx hardhat verify --network baseSepolia DEPLOYED_POOL_ADDRESS 0x4200000000000000000000000000000000000006
npx hardhat verify --network baseSepolia DEPLOYED_FLASHLOAN_ADDRESS POOL_ADDRESS TREASURY_ADDRESS ECOSYSTEM_REWARDS_ADDRESS
```

## Contract Addresses (To be filled after deployment)

| Contract | Address | Tx Hash |
|----------|---------|---------|
| ClawLendPool | `0x...` | `0x...` |
| ClawLendFlashLoan | `0x...` | `0x...` |
| WETH (Base Sepolia) | `0x4200000000000000000000000000000000000006` | - |

## Post-Deployment Steps

1. Update SDK addresses in `packages/sdk/src/clawlend/index.ts`
2. Update Mission Control agent configs
3. Seed pool with initial liquidity
4. Test flash loan functionality
5. Verify on Basescan

## Configuration Parameters

### ClawLendPool
- Asset: WETH (0x420...0006)
- Min Deposit: 0.01 ETH
- Max Loan %: 33% of pool
- Withdrawal Buffer: 0 (configurable)

### ClawLendFlashLoan
- Fee: 0% (free for agents)
- Tier 0 Max: 10 ETH
- Tier 1 Max: 25 ETH  
- Tier 2 Max: 50 ETH
- Tier 3 Max: 100 ETH
- Min Borrow: 0.001 ETH
