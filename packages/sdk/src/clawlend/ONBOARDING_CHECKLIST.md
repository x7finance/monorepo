# ClawLend Developer Onboarding Checklist

Use this checklist to get your first ClawLend agent from idea to production.

## Phase 1: Setup (15 minutes)

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] Code editor (VS Code recommended)
- [ ] Basic Solidity knowledge
- [ ] Familiarity with TypeScript

### Environment Setup

- [ ] Clone x7/monorepo: `git clone https://github.com/x7finance/monorepo.git`
- [ ] Install dependencies: `bun install` or `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set up Infura API key
- [ ] Verify build works: `bun run build`

### Wallet Setup

- [ ] Create test wallet for development
- [ ] Fund with Base Sepolia ETH
  - [ ] Get from faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
  - [ ] Or bridge from Sepolia: https://bridge.base.org/deposit
- [ ] Verify balance: `npx hardhat balance --network baseSepolia WALLET_ADDRESS`

## Phase 2: Understanding (30 minutes)

### Read Documentation

- [ ] Read GETTING_STARTED.md
- [ ] Read SDK README.md
- [ ] Review example strategies (3 contracts)
- [ ] Understand agent tier system
- [ ] Review security considerations

### Explore Contracts

- [ ] Read ClawLendPool.sol (understand ERC4626 vault)
- [ ] Read ClawLendFlashLoan.sol (understand flash loan mechanics)
- [ ] Read ClawLendBorrower.sol (base contract for strategies)
- [ ] Run existing tests: `npx hardhat test`

### Study Examples

- [ ] Analyze BaseArbitrageAgent.sol
- [ ] Analyze LiquidationHunter.sol
- [ ] Analyze X7EcosystemArbitrage.sol
- [ ] Understand the `_executeStrategy` pattern

## Phase 3: First Strategy (1 hour)

### Choose Strategy Type

- [ ] Decide on strategy (arbitrage/liquidation/custom)
- [ ] Identify target opportunities
- [ ] Calculate expected profitability
- [ ] Ensure gas costs < expected profit

### Implement Strategy

- [ ] Create new file in `contracts/src/clawlend/examples/`
- [ ] Inherit from `ClawLendBorrower`
- [ ] Implement `_executeStrategy` function
- [ ] Add proper error handling
- [ ] Include events for monitoring
- [ ] Add NatSpec comments

### Test Locally

- [ ] Write unit tests
- [ ] Test with Hardhat network
- [ ] Verify all revert conditions
- [ ] Check gas usage
- [ ] Run `bun run checks`

## Phase 4: Deploy to Testnet (30 minutes)

### Deploy ClawLend Contracts (if not deployed)

- [ ] Update Ignition module with your addresses
- [ ] Run deployment: `npx hardhat ignition deploy ignition/modules/ClawLendTestnet.js --network baseSepolia`
- [ ] Save deployed addresses
- [ ] Verify contracts on Basescan
- [ ] Update SDK addresses

### Deploy Your Strategy

- [ ] Compile contracts: `npx hardhat compile`
- [ ] Deploy strategy contract
- [ ] Save contract address
- [ ] Verify contract on Basescan

### Test Flash Loan

- [ ] Approve WETH for strategy (if needed)
- [ ] Execute test flash loan with small amount (0.01 ETH)
- [ ] Verify transaction succeeds
- [ ] Check agent stats updated
- [ ] Verify tier progression working

## Phase 5: Optimize (2+ hours)

### Improve Strategy

- [ ] Add profit threshold checks
- [ ] Implement slippage protection
- [ ] Add gas price awareness
- [ ] Optimize for gas efficiency
- [ ] Handle edge cases

### Add Monitoring

- [ ] Set up event listeners
- [ ] Create profit tracking
- [ ] Add alerting for failures
- [ ] Build dashboard (optional)

### Security Review

- [ ] Check for reentrancy vulnerabilities
- [ ] Verify all external calls are safe
- [ ] Review access controls
- [ ] Test with malicious inputs
- [ ] Get peer review

## Phase 6: Production Readiness (1 hour)

### Documentation

- [ ] Write strategy documentation
- [ ] Include setup instructions
- [ ] Document expected returns
- [ ] Add architecture diagrams
- [ ] Create runbook for operations

### Testing

- [ ] Achieve >90% test coverage
- [ ] Test with mainnet forks
- [ ] Stress test with large amounts
- [ ] Simulate failure scenarios

### Monitoring Setup

- [ ] Set up error tracking
- [ ] Configure alerting
- [ ] Create health checks
- [ ] Build logging infrastructure

## Phase 7: Launch (30 minutes)

### Final Checks

- [ ] Review all contracts one final time
- [ ] Verify contract verification on explorer
- [ ] Check all addresses are correct
- [ ] Ensure monitoring is active
- [ ] Have emergency procedures ready

### Execute

- [ ] Start with small amounts
- [ ] Gradually increase position sizes
- [ ] Monitor closely for first 24 hours
- [ ] Document any issues
- [ ] Iterate based on learnings

## Contest Submission Checklist

If submitting to the Build an Agent Contest:

### Required

- [ ] Strategy contract deployed to testnet
- [ ] Working demo video (2-5 minutes)
- [ ] GitHub repository with code
- [ ] README with setup instructions
- [ ] Documentation of expected returns

### Recommended

- [ ] Live deployment with real profits
- [ ] Unit tests with >80% coverage
- [ ] Architecture diagram
- [ ] Blog post explaining strategy
- [ ] Twitter thread announcing it

### Judging Criteria

- [ ] Profitability demonstrated
- [ ] Code quality (clean, documented)
- [ ] Innovation (unique approach)
- [ ] Presentation (clear explanation)
- [ ] Completeness (production-ready)

## Troubleshooting

### Common Issues

**"Insufficient repayment"**

- Strategy didn't generate enough profit
- Check slippage settings
- Verify profit > gas costs

**"Gas estimation failed"**

- Transaction will revert
- Check all approvals
- Verify contract addresses

**"Max loan exceeded"**

- Requesting more than tier allows
- Check `getAgentMaxLoan()` first
- Build reputation with smaller loans

### Getting Help

- Discord: #clawlend-dev channel
- Documentation: docs.x7.finance/clawlend
- Examples: github.com/x7finance/monorepo
- Office hours: Tuesdays 2pm ET (Discord)

## Resources

### Documentation

- SDK README: `/packages/sdk/src/clawlend/README.md`
- Getting Started: `/packages/sdk/src/clawlend/GETTING_STARTED.md`
- Deployment Guide: `/packages/contracts/ignition/modules/DEPLOYMENT.md`

### Code Examples

- BaseArbitrageAgent.sol
- LiquidationHunter.sol
- X7EcosystemArbitrage.sol

### Community

- Discord: discord.gg/x7finance
- Twitter: @X7_Finance
- GitHub: github.com/x7finance

---

**Time to first flash loan:** ~2 hours  
**Time to production agent:** ~8 hours  
**Time to contest submission:** ~16 hours

Good luck building! 🦞
