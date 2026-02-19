// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Import the base borrower contract from ClawLend
import "@x7/contracts/src/clawlend/ClawLendBorrower.sol";

/**
 * @title LiquidationHunter
 * @notice Example liquidation bot using ClawLend flash loans
 * @dev This is a template for AI agents to execute liquidations
 *
 * STRATEGY:
 * 1. Identify underwater loan in X7 Lending Protocol
 * 2. Borrow flash loan from ClawLend
 * 3. Repay the underwater loan
 * 4. Receive collateral at discount (liquidation bonus)
 * 5. Swap collateral back to loan token
 * 6. Repay flash loan + fee
 * 7. Keep liquidation reward as profit
 *
 * FLASH LOAN ADVANTAGE:
 * - No upfront capital required
 * - Can liquidate large positions instantly
 * - Profit is immediately realized
 */
contract LiquidationHunter is ClawLendBorrower {
    using SafeERC20 for IERC20;

    // ============ Errors ============
    error LiquidationFailed();
    error CollateralSwapFailed();
    error InsufficientReward();
    error InvalidLoan();

    // ============ Events ============
    event LiquidationExecuted(
        address indexed user,
        address indexed collateralToken,
        address indexed loanToken,
        uint256 loanAmount,
        uint256 collateralReceived,
        uint256 profit
    );

    // ============ Structs ============
    struct LiquidationParams {
        address lendingProtocol;  // X7 Lending Protocol address
        address user;             // User to liquidate
        address collateralToken;  // Token received as collateral
        address loanToken;        // Token to repay (WETH for ClawLend)
        address dexRouter;        // DEX to swap collateral
        uint256 minReward;        // Minimum liquidation reward required
        bytes liquidationData;    // Calldata for liquidation
        bytes swapData;           // Calldata for collateral swap
    }

    // ============ Interfaces ============
    interface ILendingProtocol {
        function liquidate(
            address user,
            uint256 amount
        ) external returns (uint256 collateralReceived);
        
        function getLoanHealth(address user) external view returns (uint256 health);
        function isLiquidatable(address user) external view returns (bool);
    }

    // ============ Constructor ============
    constructor(
        address _clawLend,
        address _weth
    ) ClawLendBorrower(_clawLend, _weth) {}

    // ============ Strategy Implementation ============

    /**
     * @notice Execute liquidation strategy
     * @param initiator Address that initiated the flash loan
     * @param token Token borrowed (WETH)
     * @param amount Amount borrowed (loan repayment amount)
     * @param fee Flash loan fee (0 for ClawLend)
     * @param data Encoded LiquidationParams
     * @return profit Net profit after repaying loan
     */
    function _executeStrategy(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) internal override returns (uint256 profit) {
        // Decode liquidation parameters
        LiquidationParams memory params = abi.decode(data, (LiquidationParams));
        
        uint256 startBalance = IERC20(token).balanceOf(address(this));
        uint256 collateralBefore = IERC20(params.collateralToken).balanceOf(address(this));
        
        // Step 1: Execute liquidation
        uint256 collateralReceived = _executeLiquidation(token, amount, params);
        
        // Step 2: Swap collateral back to loan token
        _swapCollateral(params.collateralToken, token, collateralReceived, params);
        
        // Calculate profit
        uint256 endBalance = IERC20(token).balanceOf(address(this));
        uint256 totalRepayment = amount + fee;
        
        if (endBalance < totalRepayment + params.minReward) {
            revert InsufficientReward();
        }
        
        profit = endBalance - totalRepayment;
        
        emit LiquidationExecuted(
            params.user,
            params.collateralToken,
            params.loanToken,
            amount,
            collateralReceived,
            profit
        );
        
        return profit;
    }

    /**
     * @notice Execute liquidation on lending protocol
     */
    function _executeLiquidation(
        address token,
        uint256 amount,
        LiquidationParams memory params
    ) internal returns (uint256 collateralReceived) {
        uint256 collateralBefore = IERC20(params.collateralToken).balanceOf(address(this));
        
        // Approve lending protocol to spend loan token
        IERC20(token).safeApprove(params.lendingProtocol, amount);
        
        // Execute liquidation
        (bool success, ) = params.lendingProtocol.call(params.liquidationData);
        if (!success) revert LiquidationFailed();
        
        // Calculate collateral received
        uint256 collateralAfter = IERC20(params.collateralToken).balanceOf(address(this));
        collateralReceived = collateralAfter - collateralBefore;
    }

    /**
     * @notice Swap received collateral back to loan token
     */
    function _swapCollateral(
        address collateralToken,
        address loanToken,
        uint256 amount,
        LiquidationParams memory params
    ) internal {
        // Approve DEX router
        IERC20(collateralToken).safeApprove(params.dexRouter, amount);
        
        // Execute swap
        (bool success, ) = params.dexRouter.call(params.swapData);
        if (!success) revert CollateralSwapFailed();
    }

    // ============ View Functions ============

    /**
     * @notice Check if a loan is liquidatable
     * @param lendingProtocol Address of lending protocol
     * @param user Address of borrower
     */
    function isLiquidatable(
        address lendingProtocol,
        address user
    ) external view returns (bool) {
        return ILendingProtocol(lendingProtocol).isLiquidatable(user);
    }

    /**
     * @notice Get loan health factor
     * @param lendingProtocol Address of lending protocol
     * @param user Address of borrower
     * @return health Health factor (scaled by 1e18, < 1e18 means liquidatable)
     */
    function getLoanHealth(
        address lendingProtocol,
        address user
    ) external view returns (uint256 health) {
        return ILendingProtocol(lendingProtocol).getLoanHealth(user);
    }

    /**
     * @notice Calculate expected liquidation reward
     * @param liquidationBonus Bonus percentage (e.g., 1.05 for 5% bonus)
     * @param loanAmount Amount being repaid
     * @return expectedReward Expected reward amount
     */
    function calculateReward(
        uint256 liquidationBonus,
        uint256 loanAmount
    ) external pure returns (uint256 expectedReward) {
        // Assuming bonus is scaled by 1e18
        // For 5% bonus: liquidationBonus = 1.05e18
        expectedReward = (loanAmount * (liquidationBonus - 1e18)) / 1e18;
    }

    // ============ Emergency Functions ============

    /**
     * @notice Rescue tokens (only callable by owner)
     */
    function rescueTokens(address token, uint256 amount) external {
        // Note: In production, add access control
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    receive() external payable {}
}
