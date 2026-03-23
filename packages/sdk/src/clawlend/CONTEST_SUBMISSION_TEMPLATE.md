# Build an Agent Contest - Submission Template

## $10,000 Prize Pool - ClawLend Launch Contest

---

## Submission Overview

**Agent Name:** [Your agent's name]  
**Team/Author:** [Your name or team]  
**Contact:** [Email or Discord handle]  
**Date:** [Submission date]

## Executive Summary

**Strategy Type:** [Arbitrage / Liquidation / Yield / Custom]  
**Category:** [Most Profitable / Most Creative / Best Documentation]  
**One-liner:** [Describe your agent in one sentence]

### Key Metrics

| Metric                 | Value           |
| ---------------------- | --------------- |
| Total Profit (testnet) | X ETH           |
| Success Rate           | X%              |
| Avg Profit per Trade   | X ETH           |
| Total Transactions     | X               |
| Gas Efficiency         | X gas per trade |

---

## Strategy Description

### The Opportunity

[Describe the market opportunity your agent exploits]

### How It Works

1. [Step 1: Detection]
2. [Step 2: Execution]
3. [Step 3: Settlement]

### Why Flash Loans

[Explain why flash loans are essential for this strategy]

### Competitive Advantage

[What makes your approach unique or better than alternatives]

---

## Technical Architecture

### Contract Structure

```
YourStrategy.sol
├── _executeStrategy() [Main logic]
├── [Helper functions]
└── [Events/Errors]
```

### Key Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

### Dependencies

| Contract          | Address | Purpose           |
| ----------------- | ------- | ----------------- |
| ClawLendFlashLoan | 0x...   | Flash loan source |
| DEX Router        | 0x...   | Trading           |
| Price Oracle      | 0x...   | Price data        |

---

## Code Quality

### Test Coverage

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
YourStrategy.sol    |   95.2% |    88.9% |   100%  |   94.1% | 142-145
--------------------|---------|----------|---------|---------|-------------------
```

### Security Measures

- [ ] Reentrancy protection
- [ ] Slippage controls
- [ ] Access controls
- [ ] Input validation
- [ ] Emergency pause

### Documentation

- [ ] NatSpec comments on all functions
- [ ] README with setup instructions
- [ ] Architecture diagram
- [ ] Deployment guide

---

## Performance Data

### Testnet Results

**Period:** [Start date] to [End date]

| Date       | Trades | Profit   | Gas Used | Notes   |
| ---------- | ------ | -------- | -------- | ------- |
| 2026-02-XX | 5      | 0.05 ETH | 1.2M     | [Notes] |
| 2026-02-XX | 8      | 0.08 ETH | 1.8M     | [Notes] |

### Profitability Analysis

**Average Return:** X% per trade  
**Sharpe Ratio:** X  
**Max Drawdown:** X%  
**Win Rate:** X%

### Gas Optimization

- Optimizations applied:
  - [Optimization 1]
  - [Optimization 2]
- Average gas cost: X gas
- Estimated mainnet cost: $X per trade

---

## Risk Assessment

### Strategy Risks

| Risk     | Likelihood   | Impact       | Mitigation          |
| -------- | ------------ | ------------ | ------------------- |
| [Risk 1] | Low/Med/High | Low/Med/High | [How you handle it] |
| [Risk 2] | Low/Med/High | Low/Med/High | [How you handle it] |

### Failure Modes

1. **Failed Execution**
   - Detection: [How you detect]
   - Recovery: [How you recover]

2. **Insufficient Profit**
   - Detection: [How you detect]
   - Recovery: [How you recover]

3. **Network Congestion**
   - Detection: [How you detect]
   - Recovery: [How you recover]

---

## Repository Structure

```
your-agent/
├── contracts/
│   ├── YourStrategy.sol      # Main strategy contract
│   ├── libraries/            # Helper libraries
│   └── interfaces/           # Interface definitions
├── test/
│   ├── YourStrategy.test.js  # Unit tests
│   └── integration/          # Integration tests
├── scripts/
│   ├── deploy.js             # Deployment script
│   └── monitor.js            # Monitoring script
├── docs/
│   ├── ARCHITECTURE.md       # Architecture docs
│   └── OPERATIONS.md         # Runbook
├── README.md                 # Main documentation
└── package.json
```

---

## Demo

### Video Link

[Link to demo video (2-5 minutes)]

### Video Outline

1. **0:00-0:30** - Introduction and strategy overview
2. **0:30-2:00** - Code walkthrough
3. **2:00-3:30** - Live demo on testnet
4. **3:30-4:30** - Performance metrics
5. **4:30-5:00** - Conclusion and next steps

### Live Demo

**Transaction Hash:** 0x...  
**Explorer Link:** https://sepolia.basescan.org/tx/0x...

---

## Deployment

### Contract Addresses

| Contract     | Network      | Address | Verified |
| ------------ | ------------ | ------- | -------- |
| YourStrategy | Base Sepolia | 0x...   | ✅       |
| YourStrategy | Base Mainnet | 0x...   | ⏳       |

### Deployment Commands

```bash
# Testnet
npx hardhat run scripts/deploy.js --network baseSepolia

# Mainnet (when ready)
npx hardhat run scripts/deploy.js --network base
```

---

## Operations

### Monitoring

- **Dashboard:** [Link if available]
- **Alerts:** [How you get notified of issues]
- **Logging:** [Where logs are stored]

### Maintenance

- **Update frequency:** [How often you update]
- **Parameter tuning:** [How you optimize parameters]
- **Incident response:** [How you handle issues]

### Costs

- **Infrastructure:** $X/month
- **Gas costs:** $X/month (estimated mainnet)
- **Labor:** X hours/week

---

## Future Improvements

### Short Term (Next 30 days)

- [ ] [Improvement 1]
- [ ] [Improvement 2]

### Long Term (Next 6 months)

- [ ] [Improvement 3]
- [ ] [Improvement 4]

### Research Areas

- [Research topic 1]
- [Research topic 2]

---

## Team

### Members

| Name   | Role   | Background   | Contribution    |
| ------ | ------ | ------------ | --------------- |
| [Name] | [Role] | [Background] | [What they did] |

### Acknowledgments

- [Anyone you want to thank]
- [Libraries/tools used]

---

## Additional Information

### Why ClawLend?

[Why you chose to build on ClawLend]

### Lessons Learned

[What you learned building this agent]

### Advice for Others

[Tips for other developers]

---

## Submission Checklist

- [ ] Repository is public or access granted to judges
- [ ] All code is original or properly licensed
- [ ] Contracts deployed and verified on testnet
- [ ] Demo video uploaded and link provided
- [ ] README includes setup instructions
- [ ] Tests pass (`npm test` succeeds)
- [ ] No malicious code or exploits
- [ ] Submission is complete and well-documented

---

## Judges' Notes

_This section for judges only_

**Initial Review:** [Date]  
**Reviewer:** [Name]  
**Score:** X/100  
**Notes:** [Judge's comments]

---

## Submission Links

- **Repository:** https://github.com/[username]/[repo]
- **Demo Video:** [Link]
- **Live Demo:** [Link if applicable]
- **Documentation:** [Link to docs]
- **Twitter Thread:** [Link to announcement]

---

**Submit by:** [Contest end date]  
**Submit to:** [contest.x7.finance](https://contest.x7.finance) or [email]  
**Questions:** discord.gg/x7finance

Good luck! 🦞
