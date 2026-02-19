// ClawLend Testnet Interactions Script
// Run with: npx hardhat run scripts/clawlend-testnet.js --network baseSepolia

const { ethers } = require("hardhat")

// Update these after deployment
const CLAWLEND_POOL = "0x0000000000000000000000000000000000000000" // TODO: Update
const CLAWLEND_FLASHLOAN = "0x0000000000000000000000000000000000000000" // TODO: Update
const WETH = "0x4200000000000000000000000000000000000006"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Interacting with contracts using account:", deployer.address)

  // Get contract instances
  const pool = await ethers.getContractAt("ClawLendPool", CLAWLEND_POOL)
  const flashLoan = await ethers.getContractAt(
    "ClawLendFlashLoan",
    CLAWLEND_FLASHLOAN
  )
  const weth = await ethers.getContractAt("IWETH", WETH)

  // 1. Check pool metrics
  console.log("\n--- Pool Metrics ---")
  const totalAssets = await pool.totalAssets()
  const totalSupply = await pool.totalSupply()
  const availableLiquidity = await pool.availableLiquidity()
  console.log(`Total Assets: ${ethers.formatEther(totalAssets)} ETH`)
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} shares`)
  console.log(
    `Available Liquidity: ${ethers.formatEther(availableLiquidity)} ETH`
  )

  // 2. Check agent stats for deployer
  console.log("\n--- Agent Stats ---")
  const agentStats = await flashLoan.agentStats(deployer.address)
  console.log(`Loan Count: ${agentStats.loanCount}`)
  console.log(`Total Volume: ${ethers.formatEther(agentStats.totalVolume)} ETH`)
  console.log(`Tier: ${agentStats.tier}`)

  const maxLoan = await flashLoan.getAgentMaxLoan(deployer.address)
  console.log(`Max Loan: ${ethers.formatEther(maxLoan)} ETH`)

  // 3. Seed pool with liquidity (if needed)
  const depositAmount = ethers.parseEther("0.1")
  if (totalAssets < depositAmount) {
    console.log("\n--- Seeding Pool ---")
    console.log(`Depositing ${ethers.formatEther(depositAmount)} ETH...`)

    // Wrap ETH to WETH
    const wrapTx = await weth.deposit({ value: depositAmount })
    await wrapTx.wait()
    console.log("ETH wrapped to WETH")

    // Approve pool to spend WETH
    const approveTx = await weth.approve(CLAWLEND_POOL, depositAmount)
    await approveTx.wait()
    console.log("WETH approved for pool")

    // Deposit to pool
    const depositTx = await pool.deposit(depositAmount, deployer.address)
    await depositTx.wait()
    console.log("Deposited to ClawLendPool")
  }

  // 4. Deploy a test borrower contract
  console.log("\n--- Deploying Test Borrower ---")
  const TestBorrower = await ethers.getContractFactory("MockBorrower")
  const testBorrower = await TestBorrower.deploy(CLAWLEND_FLASHLOAN, WETH)
  await testBorrower.waitForDeployment()
  console.log(`TestBorrower deployed to: ${await testBorrower.getAddress()}`)

  // 5. Execute test flash loan
  console.log("\n--- Executing Test Flash Loan ---")
  const loanAmount = ethers.parseEther("0.01") // Small test amount
  console.log(`Requesting flash loan: ${ethers.formatEther(loanAmount)} ETH`)

  try {
    const flashTx = await flashLoan.flashLoan(
      await testBorrower.getAddress(),
      WETH,
      loanAmount,
      "0x" // empty data
    )
    await flashTx.wait()
    console.log("Flash loan executed successfully!")
  } catch (error) {
    console.error("Flash loan failed:", error.message)
  }

  // 6. Check updated metrics
  console.log("\n--- Updated Pool Metrics ---")
  const newTotalAssets = await pool.totalAssets()
  const newAvailableLiquidity = await pool.availableLiquidity()
  console.log(`Total Assets: ${ethers.formatEther(newTotalAssets)} ETH`)
  console.log(
    `Available Liquidity: ${ethers.formatEther(newAvailableLiquidity)} ETH`
  )

  // 7. Check updated agent stats
  console.log("\n--- Updated Agent Stats ---")
  const newAgentStats = await flashLoan.agentStats(deployer.address)
  console.log(`Loan Count: ${newAgentStats.loanCount}`)
  console.log(
    `Total Volume: ${ethers.formatEther(newAgentStats.totalVolume)} ETH`
  )

  console.log("\n--- Test Complete ---")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
