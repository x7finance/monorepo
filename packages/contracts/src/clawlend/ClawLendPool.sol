// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ClawLendPool
 * @notice ERC4626 vault providing liquidity for flash loans
 * @dev Integrates with ClawLendFlashLoan for WETH flash loans
 *
 *   SECURITY MODEL:
 *
 *   1. ERC4626 Inflation Protection
 *      We use _decimalsOffset() to add virtual shares, preventing the
 *      "first depositor" attack where an attacker can manipulate share
 *      price by depositing 1 wei then donating tokens directly.
 *      See: https://docs.openzeppelin.com/contracts/5.x/erc4626#inflation-attack
 *
 *   2. Flash Loan Authorization
 *      Only authorized flash loan contracts can withdraw/deposit.
 *      Owner must carefully vet any authorized contract since they have
 *      full access to pool liquidity. Authorization should use timelock
 *      in production for governance safety.
 *
 *   3. Withdrawal Limits
 *      User withdrawals are limited by available liquidity (excluding buffer).
 *      Flash loans are atomic so liquidity is always returned within tx.
 *
 *   4. Fee Tracking
 *      We track fees separately from principal for accurate APY calculation.
 *      The flash loan contract calls depositFees() for fees and
 *      depositPrincipal() for principal returns.
 *
 * ██████╗██╗      █████╗ ██╗    ██╗██╗     ███████╗███╗   ██╗██████╗
 * ██╔════╝██║     ██╔══██╗██║    ██║██║     ██╔════╝████╗  ██║██╔══██╗
 * ██║     ██║     ███████║██║ █╗ ██║██║     █████╗  ██╔██╗ ██║██║  ██║
 * ██║     ██║     ██╔══██║██║███╗██║██║     ██╔══╝  ██║╚██╗██║██║  ██║
 * ╚██████╗███████╗██║  ██║╚███╔███╔╝███████╗███████╗██║ ╚████║██████╔╝
 *  ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚═════╝
 */
contract ClawLendPool is ERC4626, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Constants ============

    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice Maximum single flash loan as percentage of pool (33%)
    /// @dev Prevents single loan from draining all liquidity
    uint256 public constant MAX_LOAN_PERCENT = 3300;

    /// @notice Minimum deposit to prevent dust and ensure meaningful LP positions
    uint256 public constant MIN_DEPOSIT = 0.01 ether;

    // ============ ERC4626 Inflation Protection ============
    //
    // VULNERABILITY: First Depositor Attack
    //
    // Without protection, an attacker could:
    //   1. Deposit 1 wei, receive 1 share
    //   2. Transfer 10 ETH directly to pool (not via deposit)
    //   3. totalAssets = 10 ETH, totalSupply = 1 share
    //   4. Victim deposits 10 ETH, receives 10e18 * 1 / 10e18 = 1 share (rounded)
    //   5. Attacker redeems 1 share for ~10 ETH, stealing victim's deposit
    //
    // SOLUTION: Virtual Shares Offset
    //
    // By returning 3 from _decimalsOffset(), we add 10^3 = 1000 virtual shares
    // to all calculations. This means:
    //   - First depositor of 1 wei gets ~1000 shares, not 1
    //   - Direct transfers don't significantly affect share price
    //   - Attack becomes economically infeasible
    //
    // Cost: Slightly higher rounding errors (negligible for ETH amounts)

    function _decimalsOffset() internal pure override returns (uint8) {
        return 3;
    }

    // ============ State Variables ============

    /// @notice Authorized ClawLendFlashLoan contracts that can access liquidity
    /// @dev TRUST ASSUMPTION: Authorized contracts have full access to pool funds.
    ///      Owner must verify contract code before authorization.
    ///      Consider timelock for production deployments.
    mapping(address => bool) public authorizedFlashLoans;

    /// @notice Supported tokens for flash loans (only underlying asset by default)
    mapping(address => bool) public supportedTokens;

    /// @notice Minimum liquidity buffer that cannot be borrowed
    /// @dev Set to 0 by default. Can be increased for safety margin.
    uint256 public minLiquidityBuffer;

    /// @notice Total fees deposited back to pool (increases share value)
    /// @dev Only updated via depositFees(), not depositPrincipal()
    uint256 public totalFeesDeposited;

    /// @notice Total principal moved through flash loans
    uint256 public totalPrincipalLoaned;

    /// @notice Total number of flash loans executed
    uint256 public totalFlashLoans;

    // ============ Events ============

    event FlashLoanContractAuthorized(address indexed flashLoan, bool authorized);
    event SupportedTokenAdded(address indexed token);
    event SupportedTokenRemoved(address indexed token);
    event FeesDeposited(address indexed token, uint256 amount, uint256 newSharePrice);
    event PrincipalDeposited(address indexed token, uint256 amount);
    event PrincipalWithdrawn(address indexed token, uint256 amount);
    event LiquidityBufferUpdated(uint256 newBuffer);
    event EmergencyRescue(address indexed token, uint256 amount, address indexed recipient);

    // ============ Errors ============

    error UnauthorizedFlashLoan();
    error UnsupportedToken();
    error BelowMinimumDeposit();
    error InsufficientLiquidity();
    error InvalidAddress();
    error CannotRescueAsset();
    error ZeroAmount();

    // ============ Modifiers ============

    modifier onlyFlashLoan() {
        if (!authorizedFlashLoans[msg.sender]) revert UnauthorizedFlashLoan();
        _;
    }

    modifier onlySupportedToken(address token) {
        if (!supportedTokens[token]) revert UnsupportedToken();
        _;
    }

    // ============ Constructor ============

    /**
     * @notice Deploy the ClawLendPool
     * @param _asset The underlying asset (WETH)
     * @param _name The vault token name (e.g., "ClawLend WETH")
     * @param _symbol The vault token symbol (e.g., "cWETH")
     */
    constructor(
        address _asset,
        string memory _name,
        string memory _symbol
    ) ERC4626(IERC20(_asset)) ERC20(_name, _symbol) Ownable(msg.sender) {
        if (_asset == address(0)) revert InvalidAddress();

        // The underlying asset is always supported for flash loans
        supportedTokens[_asset] = true;
        emit SupportedTokenAdded(_asset);
    }

    // ============ ERC4626 Overrides ============

    /**
     * @notice Deposit assets and receive shares
     * @param assets Amount of assets to deposit
     * @param receiver Address to receive shares
     * @return shares Amount of shares minted
     */
    function deposit(uint256 assets, address receiver)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 shares)
    {
        if (assets < MIN_DEPOSIT) revert BelowMinimumDeposit();
        shares = super.deposit(assets, receiver);
    }

    /**
     * @notice Mint shares by depositing assets
     * @param shares Amount of shares to mint
     * @param receiver Address to receive shares
     * @return assets Amount of assets deposited
     */
    function mint(uint256 shares, address receiver)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 assets)
    {
        assets = super.mint(shares, receiver);
        if (assets < MIN_DEPOSIT) revert BelowMinimumDeposit();
    }

    /**
     * @notice Withdraw assets by burning shares
     * @param assets Amount of assets to withdraw
     * @param receiver Address to receive assets
     * @param owner Address that owns the shares
     * @return shares Amount of shares burned
     */
    function withdraw(uint256 assets, address receiver, address owner)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 shares)
    {
        // Check liquidity excluding buffer
        if (assets > getAvailableLiquidity(address(asset()))) {
            revert InsufficientLiquidity();
        }
        shares = super.withdraw(assets, receiver, owner);
    }

    /**
     * @notice Redeem shares for assets
     * @param shares Amount of shares to redeem
     * @param receiver Address to receive assets
     * @param owner Address that owns the shares
     * @return assets Amount of assets received
     */
    function redeem(uint256 shares, address receiver, address owner)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256 assets)
    {
        assets = previewRedeem(shares);

        if (assets > getAvailableLiquidity(address(asset()))) {
            revert InsufficientLiquidity();
        }
        assets = super.redeem(shares, receiver, owner);
    }

    // ============ Flash Loan Integration ============
    //
    // These functions are called by authorized flash loan contracts.
    // We separate fee deposits from principal deposits to accurately
    // track fee income vs principal cycling.

    /**
     * @notice Deposit fees back into the pool (70% of flash loan fees)
     * @dev Increases share value for all LPs
     * @param token The token being deposited
     * @param amount Fee amount to deposit
     */
    function depositFees(address token, uint256 amount)
        external
        nonReentrant
        onlyFlashLoan
        onlySupportedToken(token)
    {
        if (amount == 0) revert ZeroAmount();

        // Pull tokens from flash loan contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Track fee income (this is real yield for LPs)
        totalFeesDeposited += amount;

        // Calculate new share price for event
        uint256 supply = totalSupply();
        uint256 newSharePrice = supply > 0 ? (totalAssets() * 1e18) / supply : 1e18;

        emit FeesDeposited(token, amount, newSharePrice);
    }

    /**
     * @notice Return principal to the pool after flash loan
     * @dev Does NOT count as fee income
     * @param token The token being returned
     * @param amount Principal amount being returned
     */
    function depositPrincipal(address token, uint256 amount)
        external
        nonReentrant
        onlyFlashLoan
        onlySupportedToken(token)
    {
        if (amount == 0) revert ZeroAmount();

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        emit PrincipalDeposited(token, amount);
    }

    /**
     * @notice Legacy deposit function for backward compatibility
     * @dev Counts as fees - new integrations should use depositFees/depositPrincipal
     */
    function deposit(address token, uint256 amount)
        external
        nonReentrant
        onlyFlashLoan
        onlySupportedToken(token)
    {
        if (amount == 0) revert ZeroAmount();

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // For backward compatibility, treat all deposits as fees
        // New flash loan contract should use depositFees/depositPrincipal
        totalFeesDeposited += amount;

        uint256 supply = totalSupply();
        uint256 newSharePrice = supply > 0 ? (totalAssets() * 1e18) / supply : 1e18;

        emit FeesDeposited(token, amount, newSharePrice);
    }

    /**
     * @notice Withdraw tokens from the pool for flash loan
     * @param token The token to withdraw
     * @param amount Amount to withdraw
     * @return success Always true if no revert
     */
    function withdraw(address token, uint256 amount)
        external
        nonReentrant
        onlyFlashLoan
        onlySupportedToken(token)
        returns (bool)
    {
        if (amount == 0) revert ZeroAmount();

        if (amount > getAvailableLiquidity(token)) {
            revert InsufficientLiquidity();
        }

        // Track stats
        totalPrincipalLoaned += amount;
        totalFlashLoans++;

        // Transfer to flash loan contract
        IERC20(token).safeTransfer(msg.sender, amount);

        emit PrincipalWithdrawn(token, amount);

        return true;
    }

    /**
     * @notice Get available liquidity for flash loans
     * @param token The token to check (must be supported)
     * @return Available amount (total assets minus buffer)
     */
    function getAvailableLiquidity(address token) public view returns (uint256) {
        // Return 0 for unsupported tokens instead of reverting
        // This allows integrators to safely check any token
        if (!supportedTokens[token]) return 0;

        uint256 total = totalAssets();

        if (total <= minLiquidityBuffer) {
            return 0;
        }

        unchecked {
            return total - minLiquidityBuffer;
        }
    }

    /**
     * @notice Get maximum flash loan amount for a token
     * @param token The token to check
     * @return Max loan amount (33% of available liquidity)
     */
    function maxFlashLoan(address token) external view returns (uint256) {
        uint256 available = getAvailableLiquidity(token);
        return (available * MAX_LOAN_PERCENT) / BPS_DENOMINATOR;
    }

    // ============ Admin Functions ============

    /**
     * @notice Authorize or deauthorize a flash loan contract
     * @dev CRITICAL: Authorized contracts have full access to pool funds.
     *      Only authorize audited contracts. Consider using timelock.
     * @param flashLoanContract The contract to authorize
     * @param authorized True to authorize, false to deauthorize
     */
    function authorizeFlashLoan(address flashLoanContract, bool authorized)
        external
        onlyOwner
    {
        if (flashLoanContract == address(0)) revert InvalidAddress();

        authorizedFlashLoans[flashLoanContract] = authorized;

        emit FlashLoanContractAuthorized(flashLoanContract, authorized);
    }

    /**
     * @notice Add a supported token for flash loans
     * @param token The token to add
     */
    function addSupportedToken(address token) external onlyOwner {
        if (token == address(0)) revert InvalidAddress();

        supportedTokens[token] = true;

        emit SupportedTokenAdded(token);
    }

    /**
     * @notice Remove a supported token
     * @param token The token to remove (cannot be underlying asset)
     */
    function removeSupportedToken(address token) external onlyOwner {
        if (token == address(asset())) revert CannotRescueAsset();

        supportedTokens[token] = false;

        emit SupportedTokenRemoved(token);
    }

    /**
     * @notice Set the minimum liquidity buffer
     * @dev Buffer is reserved and cannot be borrowed via flash loans
     * @param buffer The new buffer amount
     */
    function setMinLiquidityBuffer(uint256 buffer) external onlyOwner {
        minLiquidityBuffer = buffer;

        emit LiquidityBufferUpdated(buffer);
    }

    /// @notice Pause the contract (emergency only)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Rescue tokens sent by mistake
     * @dev Cannot rescue underlying asset to prevent theft from LPs
     * @param token Token to rescue
     * @param amount Amount to rescue
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        if (token == address(asset())) revert CannotRescueAsset();

        IERC20(token).safeTransfer(owner(), amount);

        emit EmergencyRescue(token, amount, owner());
    }

    // ============ View Functions ============

    /**
     * @notice Get estimated APY based on historical performance
     * @dev This is a rough estimate for display purposes only.
     *      Actual returns depend on flash loan volume and fees.
     * @return apy Estimated annual percentage yield in basis points
     *
     * Calculation:
     *   APY = (totalFees / totalPrincipalLoaned) * (loansPerYear)
     *
     * We estimate loans per year based on average loan frequency.
     * This is inherently imprecise - use for UI display only.
     */
    function estimatedAPY() external view returns (uint256 apy) {
        if (totalFlashLoans == 0 || totalPrincipalLoaned == 0) {
            return 0;
        }

        // Fee rate: 70% of 0.09% = 0.063% per loan goes to LPs
        // In basis points: 6.3 bps per loan
        uint256 feeRateBps = 63; // 0.063% in basis points * 10 for precision

        // Calculate utilization: total loaned / TVL
        uint256 tvl = totalAssets();
        if (tvl == 0) return 0;

        // Average loan size
        uint256 avgLoanSize = totalPrincipalLoaned / totalFlashLoans;

        // Estimate: if each loan turns over the TVL once per day
        // Real APY = feeRate * 365 * utilization
        // This is a rough heuristic - actual APY varies with volume
        uint256 utilizationBps = (avgLoanSize * BPS_DENOMINATOR) / tvl;

        // Cap utilization at 100%
        if (utilizationBps > BPS_DENOMINATOR) {
            utilizationBps = BPS_DENOMINATOR;
        }

        // Estimate 1 loan per day on average (conservative)
        // APY = feeRate * 365 * (avgLoan / tvl)
        apy = (feeRateBps * 365 * utilizationBps) / BPS_DENOMINATOR / 10;
    }

    /**
     * @notice Get comprehensive pool stats
     * @return stats Array: [totalAssets, totalSupply, availableLiquidity, totalFees, totalLoans]
     */
    function getStats() external view returns (uint256[5] memory stats) {
        stats[0] = totalAssets();
        stats[1] = totalSupply();
        stats[2] = getAvailableLiquidity(address(asset()));
        stats[3] = totalFeesDeposited;
        stats[4] = totalFlashLoans;
    }

    /**
     * @notice Check if a flash loan contract is authorized
     * @param flashLoan The contract to check
     * @return True if authorized
     */
    function isAuthorizedFlashLoan(address flashLoan) external view returns (bool) {
        return authorizedFlashLoans[flashLoan];
    }

    /**
     * @notice Get current share price (assets per share)
     * @return price Share price in wei (1e18 = 1.0)
     */
    function sharePrice() external view returns (uint256 price) {
        uint256 supply = totalSupply();

        if (supply == 0) {
            return 1e18;
        }

        price = (totalAssets() * 1e18) / supply;
    }
}
