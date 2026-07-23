import type { Address, PublicClient, WalletClient, Hash } from "viem"

import { ClawLendPool, ClawLendFlashLoan } from "@x7/contracts"

export interface ClawLendConfig {
  poolAddress: Address
  flashLoanAddress: Address
  wethAddress: Address
}

/**
 * The zero address used as a placeholder for ClawLend contracts that have not
 * yet been deployed. Using it in a transaction would send funds to nowhere.
 */
export const ZERO_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000"

/**
 * ClawLend contracts are not yet deployed on any chain. This flag lets
 * consumers gate features off until real addresses are populated below.
 */
export const CLAWLEND_DEPLOYED = false

function isPlaceholderConfig(config: ClawLendConfig): boolean {
  return (
    config.poolAddress === ZERO_ADDRESS ||
    config.flashLoanAddress === ZERO_ADDRESS
  )
}

/**
 * Safely resolve ClawLend addresses for a chain. Throws loudly if ClawLend is
 * not configured or still points at placeholder (zero) addresses, preventing
 * accidental transactions to the zero address.
 */
export function getClawLendAddresses(chainId: number): ClawLendConfig {
  const config = CLAWLEND_ADDRESSES[chainId]
  if (!config) {
    throw new Error(`ClawLend is not configured on chain ${chainId}`)
  }
  if (isPlaceholderConfig(config)) {
    throw new Error(
      `ClawLend is not yet deployed on chain ${chainId}: contract addresses are placeholders (zero address). Refusing to return them.`
    )
  }
  return config
}

export interface AgentStats {
  loanCount: bigint
  totalVolume: bigint
  tier: number
}

export interface PoolMetrics {
  totalAssets: bigint
  totalSupply: bigint
  availableLiquidity: bigint
  withdrawalBuffer: bigint
}

export class ClawLendSDK {
  private publicClient: PublicClient
  private walletClient?: WalletClient
  private config: ClawLendConfig

  constructor(
    publicClient: PublicClient,
    config: ClawLendConfig,
    walletClient?: WalletClient
  ) {
    if (isPlaceholderConfig(config)) {
      throw new Error(
        "ClawLend is not yet deployed: refusing to initialize ClawLendSDK with placeholder (zero address) contracts."
      )
    }

    this.publicClient = publicClient
    this.config = config
    this.walletClient = walletClient
  }

  // ============ Pool Read Methods ============

  async getPoolMetrics(): Promise<PoolMetrics> {
    const [totalAssets, totalSupply, availableLiquidity, withdrawalBuffer] =
      (await Promise.all([
        this.publicClient.readContract({
          address: this.config.poolAddress,
          abi: ClawLendPool,
          functionName: "totalAssets",
        }),
        this.publicClient.readContract({
          address: this.config.poolAddress,
          abi: ClawLendPool,
          functionName: "totalSupply",
        }),
        this.publicClient.readContract({
          address: this.config.poolAddress,
          abi: ClawLendPool,
          functionName: "availableLiquidity",
        }),
        this.publicClient.readContract({
          address: this.config.poolAddress,
          abi: ClawLendPool,
          functionName: "withdrawalBuffer",
        }),
      ])) as [bigint, bigint, bigint, bigint]

    return {
      totalAssets,
      totalSupply,
      availableLiquidity,
      withdrawalBuffer,
    }
  }

  async getAgentStats(agentAddress: Address): Promise<AgentStats> {
    const stats = (await this.publicClient.readContract({
      address: this.config.flashLoanAddress,
      abi: ClawLendFlashLoan,
      functionName: "agentStats",
      args: [agentAddress],
    })) as [bigint, bigint, number]

    return {
      loanCount: stats[0],
      totalVolume: stats[1],
      tier: stats[2],
    }
  }

  async getAgentMaxLoan(agentAddress: Address): Promise<bigint> {
    return (await this.publicClient.readContract({
      address: this.config.flashLoanAddress,
      abi: ClawLendFlashLoan,
      functionName: "getAgentMaxLoan",
      args: [agentAddress],
    })) as bigint
  }

  async getAgentTier(agentAddress: Address): Promise<number> {
    return (await this.publicClient.readContract({
      address: this.config.flashLoanAddress,
      abi: ClawLendFlashLoan,
      functionName: "getAgentTier",
      args: [agentAddress],
    })) as number
  }

  // ============ Pool Write Methods ============

  async deposit(assets: bigint, receiver: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet client required")

    const account = this.walletClient.account
    if (!account) throw new Error("Account required")

    const chain = this.publicClient.chain
    if (!chain) throw new Error("Chain required")

    return this.walletClient.writeContract({
      address: this.config.poolAddress,
      abi: ClawLendPool,
      functionName: "deposit",
      args: [assets, receiver],
      account,
      chain,
    })
  }

  async withdraw(
    assets: bigint,
    receiver: Address,
    owner: Address
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet client required")

    const account = this.walletClient.account
    if (!account) throw new Error("Account required")

    const chain = this.publicClient.chain
    if (!chain) throw new Error("Chain required")

    return this.walletClient.writeContract({
      address: this.config.poolAddress,
      abi: ClawLendPool,
      functionName: "withdraw",
      args: [assets, receiver, owner],
      account,
      chain,
    })
  }

  async redeem(
    shares: bigint,
    receiver: Address,
    owner: Address
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet client required")

    const account = this.walletClient.account
    if (!account) throw new Error("Account required")

    const chain = this.publicClient.chain
    if (!chain) throw new Error("Chain required")

    return this.walletClient.writeContract({
      address: this.config.poolAddress,
      abi: ClawLendPool,
      functionName: "redeem",
      args: [shares, receiver, owner],
      account,
      chain,
    })
  }

  // ============ Flash Loan Methods ============

  async executeFlashLoan(
    receiver: Address,
    token: Address,
    amount: bigint,
    data: `0x${string}`
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet client required")

    const account = this.walletClient.account
    if (!account) throw new Error("Account required")

    const chain = this.publicClient.chain
    if (!chain) throw new Error("Chain required")

    return this.walletClient.writeContract({
      address: this.config.flashLoanAddress,
      abi: ClawLendFlashLoan,
      functionName: "flashLoan",
      args: [receiver, token, amount, data],
      account,
      chain,
    })
  }

  // ============ Utility Methods ============

  async calculateAPY(): Promise<number> {
    const metrics = await this.getPoolMetrics()

    // Simplified APY calculation
    // In production, this would use historical fee data
    if (metrics.totalAssets === 0n) return 0

    // Placeholder: assume 8% base APY when utilization is high
    const utilization =
      Number(metrics.availableLiquidity) / Number(metrics.totalAssets)
    const baseAPY = 0.08

    return utilization > 0.5 ? baseAPY : baseAPY * utilization * 2
  }

  async getUtilization(): Promise<number> {
    const metrics = await this.getPoolMetrics()
    if (metrics.totalAssets === 0n) return 0

    const used = metrics.totalAssets - metrics.availableLiquidity
    return Number(used) / Number(metrics.totalAssets)
  }
}

// ============ Constants ============

export const CLAWLEND_TIERS: Record<number, { name: string; maxLoan: bigint }> =
  {
    0: { name: "New", maxLoan: 10n }, // 10 ETH
    1: { name: "Proven", maxLoan: 25n }, // 25 ETH
    2: { name: "Established", maxLoan: 50n }, // 50 ETH
    3: { name: "Trusted", maxLoan: 100n }, // 100 ETH
  }

/**
 * WARNING: ClawLend is NOT yet deployed. The pool/flash-loan addresses below are
 * placeholder ZERO addresses. Do NOT read these directly — use
 * `getClawLendAddresses(chainId)`, which throws until real addresses are set.
 */
export const CLAWLEND_ADDRESSES: Record<number, ClawLendConfig> = {
  // Base Sepolia Testnet
  84532: {
    poolAddress: ZERO_ADDRESS, // TODO: Deploy — placeholder, not usable
    flashLoanAddress: ZERO_ADDRESS, // TODO: Deploy — placeholder, not usable
    wethAddress: "0x4200000000000000000000000000000000000006",
  },
  // Base Mainnet
  8453: {
    poolAddress: ZERO_ADDRESS, // TODO: Deploy — placeholder, not usable
    flashLoanAddress: ZERO_ADDRESS, // TODO: Deploy — placeholder, not usable
    wethAddress: "0x4200000000000000000000000000000000000006",
  },
}
