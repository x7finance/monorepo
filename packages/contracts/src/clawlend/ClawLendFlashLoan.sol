// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ClawLendFlashLoan
 * @notice Flash loan router for AI agents, integrating with X7 Finance lending pool
 * @dev Security considerations:
 *
 *   TRUST MODEL:
 *   - This contract has privileged access to withdraw from LENDING_POOL
 *   - The pool must authorize this contract via authorizeFlashLoan()
 *   - Treasury/ecosystem addresses are immutable for security
 *   - To change recipients, deploy new contract and migrate pool authorization
 *
 *   TOKEN SUPPORT:
 *   - Currently WETH-only for simplicity and safety
 *   - Uses SafeERC20 for future token expansion (handles non-compliant ERC20s)
 *   - WETH on Base is compliant, but SafeERC20 costs minimal extra gas (~100)
 *
 *   AGENT CREDIT SYSTEM:
 *   - Flash loans are FREE for all agents
 *   - Tiers unlock higher borrowing limits based on reputation
 *   - Tier 0 (New): 0-9 loans, max 10 ETH
 *   - Tier 1 (Proven): 10+ loans, max 25 ETH
 *   - Tier 2 (Established): 50+ loans & 1000+ ETH volume, max 50 ETH
 *   - Tier 3 (Trusted): 200+ loans & 10000+ ETH volume, max 100 ETH
 *   - Stats are monotonically increasing (no way to reduce count)
 *   - Overflow protection enabled (no unchecked math)
 */
contract ClawLendFlashLoan is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Constants ============

    /// @notice Flash loans are FREE - no fees charged
    /// @dev Revenue model: Future premium features (multi-block loans, priority access)
    uint256 public constant FEE_BPS = 0;

    /// @notice Basis points denominator (10000 = 100%)
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ============ Tier Thresholds ============

    /// @notice Tier 1: Proven agent (10+ loans)
    uint256 public constant TIER1_LOAN_COUNT = 10;

    /// @notice Tier 2: Established agent (50+ loans, 1000+ ETH volume)
    uint256 public constant TIER2_LOAN_COUNT = 50;
    uint256 public constant TIER2_VOLUME = 1000 ether;

    /// @notice Tier 3: Trusted agent (200+ loans, 10000+ ETH volume)
    uint256 public constant TIER3_LOAN_COUNT = 200;
    uint256 public constant TIER3_VOLUME = 10000 ether;

    // ============ Tier Max Loan Limits ============

    /// @notice Tier 0 (New): Max 10 ETH
    uint256 public constant TIER0_MAX_LOAN = 10 ether;

    /// @notice Tier 1 (Proven): Max 25 ETH
    uint256 public constant TIER1_MAX_LOAN = 25 ether;

    /// @notice Tier 2 (Established): Max 50 ETH
    uint256 public constant TIER2_MAX_LOAN = 50 ether;

    /// @notice Tier 3 (Trusted): Max 100 ETH (full pool access)
    uint256 public constant TIER3_MAX_LOAN = 100 ether;

    /// @notice Minimum borrow amount to prevent dust attacks
    uint256 public constant MIN_BORROW = 0.001 ether;

    /// @notice Expected return value from borrower callback (EIP-3156 compliant)
    bytes32 public constant CALLBACK_SUCCESS = keccak256("IClawLendBorrower.onFlashLoan");

    // ============ Immutables ============
    //
    // DESIGN DECISION: Fee recipients are immutable
    //
    // Pros:
    //   - Cannot be changed by compromised owner key
    //   - Cannot be used for governance attacks
    //   - Gas savings (~2100 per access vs SLOAD)
    //   - Clear security guarantees for depositors
    //
    // Cons:
    //   - Requires contract redeployment to change recipients
    //   - Less flexible for treasury migration
    //
    // Mitigation: Pool can deauthorize this contract and authorize a new one
    // with updated recipients. Existing reputation is not migrated (acceptable
    // tradeoff since high-volume agents can rebuild quickly).

    /// @notice X7 lending pool that provides liquidity
    address public immutable LENDING_POOL;

    /// @notice Treasury receives 20% of flash loan fees
    address public immutable TREASURY;

    /// @notice X7 ecosystem fund receives 10% of flash loan fees
    address public immutable X7_ECOSYSTEM;

    /// @notice WETH token address on Base
    address public immutable WETH;

    // ============ State ============

    /// @notice Agent reputation profile tracking loan history
    struct AgentProfile {
        uint256 loanCount;      // Total successful loans
        uint256 totalVolume;    // Cumulative WETH borrowed
        uint256 successCount;   // Always equals loanCount (reserved for future failed loan tracking)
        uint256 firstLoanTime;  // Timestamp of first loan (0 if never borrowed)
        uint256 lastLoanTime;   // Timestamp of most recent loan
    }

    /// @notice Mapping from agent address to their reputation profile
    mapping(address => AgentProfile) public agents;

    /// @notice Emergency pause flag
    bool public paused;

    // ============ Events ============

    event FlashLoan(
        address indexed initiator,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 fee,
        uint256 timestamp
    );

    /// @notice Emitted when fee is distributed to recipients
    event FeeDistributed(
        uint256 poolShare,
        uint256 treasuryShare,
        uint256 ecosystemShare
    );

    event ReputationUpdated(
        address indexed agent,
        uint256 loanCount,
        uint256 totalVolume,
        uint256 tier
    );

    event PauseStateChanged(bool paused);

    // ============ Errors ============

    error Paused();
    error UnsupportedToken();
    error InvalidAmount();
    error BelowMinimumBorrow();
    error ExceedsMaxLoan();
    error CallbackFailed();
    error RepaymentFailed();
    error InvalidCallbackReturn();
    error TransferFailed();
    error InvalidAddress();
    error ReceiverNotContract();

    // ============ Constructor ============

    constructor(
        address _lendingPool,
        address _treasury,
        address _x7Ecosystem,
        address _weth
    ) Ownable(msg.sender) {
        // Validate all addresses to prevent accidental zero-address deployment
        if (_lendingPool == address(0)) revert InvalidAddress();
        if (_treasury == address(0)) revert InvalidAddress();
        if (_x7Ecosystem == address(0)) revert InvalidAddress();
        if (_weth == address(0)) revert InvalidAddress();

        LENDING_POOL = _lendingPool;
        TREASURY = _treasury;
        X7_ECOSYSTEM = _x7Ecosystem;
        WETH = _weth;
    }

    // ============ Modifiers ============

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    // ============ Admin Functions ============

    /// @notice Pause flash loans in case of emergency
    /// @dev Only affects new loans; cannot interrupt in-flight transactions
    function pause() external onlyOwner {
        paused = true;
        emit PauseStateChanged(true);
    }

    /// @notice Resume flash loans after emergency is resolved
    function unpause() external onlyOwner {
        paused = false;
        emit PauseStateChanged(false);
    }

    // ============ View Functions ============

    /// @notice Get the fee rate in basis points
    /// @return Fee rate (always 0 - flash loans are free)
    function fee() external pure returns (uint256) {
        return FEE_BPS;
    }

    /// @notice Get fee rate for a specific tier (always 0)
    /// @param tier The tier level (0-3) - unused, all tiers are free
    /// @return Fee rate in basis points (always 0)
    function feeForTier(uint256 tier) external pure returns (uint256) {
        tier; // Silence unused parameter warning
        return FEE_BPS;
    }

    /// @notice Get maximum flash loan amount for a token (caller's tier)
    /// @param token The token to check (only WETH supported)
    /// @return Maximum borrowable amount based on caller's tier
    function maxFlashLoan(address token) external view returns (uint256) {
        return maxFlashLoanFor(token, msg.sender);
    }

    /// @notice Get maximum flash loan for a specific agent
    /// @param token The token to check (only WETH supported)
    /// @param agent The agent address
    /// @return Maximum borrowable amount based on agent's tier
    function maxFlashLoanFor(address token, address agent) public view returns (uint256) {
        if (token != WETH) return 0;

        uint256 available = IX7LendingPool(LENDING_POOL).getAvailableLiquidity(token);
        uint256 tier = _getAgentTier(agent);
        uint256 tierMax = _getTierMaxLoan(tier);

        // Return the lesser of tier max and available liquidity
        return available < tierMax ? available : tierMax;
    }

    /// @notice Get max loan limit for a tier (ignoring pool liquidity)
    /// @param tier The tier level (0-3)
    /// @return Max loan in wei
    function _getTierMaxLoan(uint256 tier) internal pure returns (uint256) {
        if (tier == 0) return TIER0_MAX_LOAN;
        if (tier == 1) return TIER1_MAX_LOAN;
        if (tier == 2) return TIER2_MAX_LOAN;
        return TIER3_MAX_LOAN;
    }

    /// @notice Calculate flash loan fee (always 0 - flash loans are free)
    /// @param token The token to borrow (must be WETH)
    /// @param amount The amount to borrow
    /// @return Fee amount in wei (always 0)
    function flashFee(address token, uint256 amount) external view returns (uint256) {
        if (token != WETH) revert UnsupportedToken();
        amount; // Silence unused parameter warning
        return 0;
    }

    /// @notice Calculate flash loan fee for a specific agent (always 0)
    /// @param token The token to borrow (must be WETH)
    /// @param amount The amount to borrow
    /// @param agent The agent address - unused, all agents are free
    /// @return Fee amount in wei (always 0)
    function flashFeeFor(address token, uint256 amount, address agent) public view returns (uint256) {
        if (token != WETH) revert UnsupportedToken();
        amount; // Silence unused parameter warning
        agent;  // Silence unused parameter warning
        return 0;
    }

    /// @notice Get full agent reputation profile
    /// @param agent The agent address to query
    /// @return Agent's reputation data
    function getAgentProfile(address agent) external view returns (AgentProfile memory) {
        return agents[agent];
    }

    /// @notice Get agent's tier level
    /// @param agent The agent address to query
    /// @return Tier level: 0=New, 1=Proven, 2=Established, 3=Trusted
    function getAgentTier(address agent) external view returns (uint256) {
        return _getAgentTier(agent);
    }

    /// @notice Internal tier calculation
    /// @dev Tier is based on both loan count AND volume for higher tiers
    function _getAgentTier(address agent) internal view returns (uint256) {
        AgentProfile memory profile = agents[agent];
        uint256 count = profile.loanCount;
        uint256 volume = profile.totalVolume;

        // Tier 3: Trusted (200+ loans AND 10000+ ETH volume)
        if (count >= TIER3_LOAN_COUNT && volume >= TIER3_VOLUME) return 3;

        // Tier 2: Established (50+ loans AND 1000+ ETH volume)
        if (count >= TIER2_LOAN_COUNT && volume >= TIER2_VOLUME) return 2;

        // Tier 1: Proven (10+ loans)
        if (count >= TIER1_LOAN_COUNT) return 1;

        // Tier 0: New agent
        return 0;
    }

    /// @notice Get tier info for an agent
    /// @param agent The agent address
    /// @return tier Current tier (0-3)
    /// @return feeBps Fee in basis points (always 0 - free)
    /// @return maxLoan Maximum loan amount for this tier
    /// @return nextTierLoans Loans needed for next tier (0 if max tier)
    /// @return nextTierVolume Volume needed for next tier (0 if max tier)
    function getAgentTierInfo(address agent) external view returns (
        uint256 tier,
        uint256 feeBps,
        uint256 maxLoan,
        uint256 nextTierLoans,
        uint256 nextTierVolume
    ) {
        AgentProfile memory profile = agents[agent];
        tier = _getAgentTier(agent);
        feeBps = 0; // Flash loans are free
        maxLoan = _getTierMaxLoan(tier);

        // Calculate progress to next tier
        if (tier == 0) {
            nextTierLoans = TIER1_LOAN_COUNT - profile.loanCount;
            nextTierVolume = 0; // Tier 1 only requires loan count
        } else if (tier == 1) {
            nextTierLoans = profile.loanCount >= TIER2_LOAN_COUNT ? 0 : TIER2_LOAN_COUNT - profile.loanCount;
            nextTierVolume = profile.totalVolume >= TIER2_VOLUME ? 0 : TIER2_VOLUME - profile.totalVolume;
        } else if (tier == 2) {
            nextTierLoans = profile.loanCount >= TIER3_LOAN_COUNT ? 0 : TIER3_LOAN_COUNT - profile.loanCount;
            nextTierVolume = profile.totalVolume >= TIER3_VOLUME ? 0 : TIER3_VOLUME - profile.totalVolume;
        } else {
            nextTierLoans = 0;
            nextTierVolume = 0;
        }
    }

    // ============ Core Function ============

    /**
     * @notice Execute a flash loan (FREE - no fees)
     * @dev Flow:
     *   1. Validate inputs and check tier-based limits
     *   2. Pull funds from lending pool
     *   3. Transfer to receiver
     *   4. Call receiver's onFlashLoan callback
     *   5. Pull repayment (principal only - no fee)
     *   6. Return principal to pool
     *   7. Update agent reputation
     *
     * @param receiver Contract that will receive funds and execute strategy
     * @param token Token to borrow (must be WETH)
     * @param amount Amount to borrow in wei
     * @param data Arbitrary data passed to receiver's callback
     */
    function flashLoan(
        address receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external nonReentrant whenNotPaused {
        // ===== Validation =====
        if (token != WETH) revert UnsupportedToken();
        if (amount == 0) revert InvalidAmount();
        if (amount < MIN_BORROW) revert BelowMinimumBorrow();

        // Receiver must be a contract to handle callback
        // Prevents wasted gas on EOA calls that would fail anyway
        if (receiver.code.length == 0) revert ReceiverNotContract();

        // Check tier-based max loan limit
        uint256 maxLoan = maxFlashLoanFor(token, msg.sender);
        if (amount > maxLoan) revert ExceedsMaxLoan();

        // ===== Pull funds from lending pool =====
        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        IX7LendingPool(LENDING_POOL).withdraw(token, amount);

        // Verify we received the expected amount (defense against pool bugs)
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        if (balanceAfter < balanceBefore + amount) revert TransferFailed();

        // ===== Transfer to receiver =====
        IERC20(token).safeTransfer(receiver, amount);

        // ===== Execute callback =====
        // Fee is 0 - flash loans are free
        bytes32 callbackReturn = IClawLendBorrower(receiver).onFlashLoan(
            msg.sender,
            token,
            amount,
            0, // No fee
            data
        );

        // Verify callback succeeded (EIP-3156 compliance)
        if (callbackReturn != CALLBACK_SUCCESS) revert InvalidCallbackReturn();

        // ===== Pull repayment from receiver (principal only) =====
        IERC20(token).safeTransferFrom(receiver, address(this), amount);

        // ===== Return principal to pool =====
        IERC20(token).forceApprove(LENDING_POOL, amount);
        IX7LendingPool(LENDING_POOL).deposit(token, amount);

        // ===== Update reputation =====
        _updateReputation(msg.sender, amount);

        emit FlashLoan(
            msg.sender,
            receiver,
            token,
            amount,
            0, // No fee
            block.timestamp
        );
    }

    // ============ Internal Functions ============

    /// @dev Update agent reputation after successful loan
    /// @param agent The agent address (msg.sender of flashLoan)
    /// @param amount The loan amount for volume tracking
    function _updateReputation(address agent, uint256 amount) internal {
        AgentProfile storage profile = agents[agent];

        if (profile.loanCount == 0) {
            profile.firstLoanTime = block.timestamp;
        }

        // Checked arithmetic to prevent overflow
        // While uint256 overflow is extremely unlikely (2^256 loans or volume),
        // we prioritize safety over the ~60 gas savings of unchecked
        profile.loanCount++;
        profile.totalVolume += amount;
        profile.successCount++;  // Reserved for future: could differ if we track failed attempts
        profile.lastLoanTime = block.timestamp;

        // Calculate new tier after update
        uint256 tier = _getAgentTier(agent);

        emit ReputationUpdated(
            agent,
            profile.loanCount,
            profile.totalVolume,
            tier
        );
    }

    // ============ Emergency Functions ============

    /**
     * @notice Rescue non-WETH tokens accidentally sent to this contract
     * @dev Cannot rescue WETH to prevent draining flash loan liquidity
     *
     * DESIGN DECISION: WETH rescue is blocked
     *
     * Rationale: If WETH could be rescued, a malicious owner could:
     *   1. Wait for flash loan to be in-flight
     *   2. Rescue the repayment before it's deposited to pool
     *
     * By blocking WETH rescue, we ensure flash loan flow cannot be interrupted.
     * Any WETH that ends up stuck here (which should never happen in normal
     * operation) is effectively donated to the pool on next loan cycle.
     *
     * @param token Token address to rescue (cannot be WETH)
     * @param amount Amount to rescue
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        if (token == WETH) revert InvalidAddress();
        IERC20(token).safeTransfer(owner(), amount);
    }
}

// ============ Interfaces ============

interface IX7LendingPool {
    function deposit(address token, uint256 amount) external;
    function withdraw(address token, uint256 amount) external;
    function getAvailableLiquidity(address token) external view returns (uint256);
}

interface IClawLendBorrower {
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32);
}
