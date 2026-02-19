// ClawLend Testnet Deployment Module
// Deploys ClawLendPool and ClawLendFlashLoan to Base Sepolia

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules")

// Base Sepolia WETH address
const WETH_BASE_SEPOLIA = "0x4200000000000000000000000000000000000006"

// Treasury and ecosystem reward addresses (placeholder - update with real addresses)
const TREASURY_PLACEHOLDER = "0x0000000000000000000000000000000000000000"
const ECOSYSTEM_REWARDS_PLACEHOLDER =
  "0x0000000000000000000000000000000000000000"

module.exports = buildModule("ClawLendTestnet", (m) => {
  // Deploy ClawLendPool with WETH as underlying asset
  const clawLendPool = m.contract("ClawLendPool", [WETH_BASE_SEPOLIA], {
    id: "ClawLendPool",
  })

  // Deploy ClawLendFlashLoan
  const clawLendFlashLoan = m.contract(
    "ClawLendFlashLoan",
    [clawLendPool, TREASURY_PLACEHOLDER, ECOSYSTEM_REWARDS_PLACEHOLDER],
    {
      id: "ClawLendFlashLoan",
    }
  )

  // Authorize the flash loan contract in the pool
  m.call(
    clawLendPool,
    "authorizeFlashLoanContract",
    [clawLendFlashLoan, true],
    {
      id: "AuthorizeFlashLoan",
    }
  )

  return { clawLendPool, clawLendFlashLoan }
})
