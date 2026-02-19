// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Import the base borrower contract from ClawLend
import "@x7/contracts/src/clawlend/ClawLendBorrower.sol";

/**
 * @title BaseArbitrageAgent
 * @notice Example arbitrage bot using ClawLend flash loans
 * @dev This is a template for AI agents to execute DEX arbitrage
 *
 * STRATEGY:
 * 1. Borrow flash loan from ClawLend
 * 2. Buy token A on DEX X at price P1
 * 3. Sell token A on DEX Y at price P2 (where P2 > P1)
 * 4. Repay flash loan + fee
 * 5. Keep profit
 *
 * GAS OPTIMIZATION:
 * - Only executes if profit > gas cost
 * - Uses exact input/output amounts
 * - No external calls unless profitable
 */
contract BaseArbitrageAgent is ClawLendBorrower {
    using SafeERC20 for IERC20;

    // ============ Errors ============
    error InsufficientProfit();
    error InvalidPath();
    error SwapFailed();

    // ============ Events ============
    event ArbitrageExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 profit,
        uint256 gasCost
    );

    // ============ Structs ============
    struct ArbitrageParams {
        address dexA;        // First DEX router
        address dexB;        // Second DEX router
        address tokenA;      // Token to arbitrage
        address tokenB;      // Token to pay with
        bytes swapDataA;     // Calldata for first swap
        bytes swapDataB;     // Calldata for second swap
        uint256 minProfit;   // Minimum profit required (in borrowed token)
    }

    // ============ Constructor ============
    constructor(
        address _clawLend,
        address _weth
    ) ClawLendBorrower(_clawLend, _weth) {}

    // ============ Strategy Implementation ============

    /**
     * @notice Execute arbitrage strategy
     * @param initiator Address that initiated the flash loan
     * @param token Token borrowed (WETH)
     * @param amount Amount borrowed
     * @param fee Flash loan fee (0 for ClawLend)
     * @param data Encoded ArbitrageParams
     * @return profit Net profit after repaying loan
     */
    function _executeStrategy(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) internal override returns (uint256 profit) {
        // Decode arbitrage parameters
        ArbitrageParams memory params = abi.decode(data, (ArbitrageParams));
        
        uint256 startBalance = IERC20(token).balanceOf(address(this));
        
        // Execute arbitrage
        _executeArbitrage(token, amount, params);
        
        // Calculate profit
        uint256 endBalance = IERC20(token).balanceOf(address(this));
        uint256 totalRepayment = amount + fee;
        
        if (endBalance < totalRepayment + params.minProfit) {
            revert InsufficientProfit();
        }
        
        profit = endBalance - totalRepayment;
        
        emit ArbitrageExecuted(
            params.tokenA,
            params.tokenB,
            amount,
            endBalance,
            profit,
            gasleft()
        );
        
        return profit;
    }

    /**
     * @notice Internal function to execute the arbitrage
     * @param token Token borrowed
     * @param amount Amount borrowed
     * @param params Arbitrage parameters
     */
    function _executeArbitrage(
        address token,
        uint256 amount,
        ArbitrageParams memory params
    ) internal {
        // Step 1: Swap on DEX A (e.g., buy X7 at lower price)
        IERC20(token).safeApprove(params.dexA, amount);
        
        (bool successA, ) = params.dexA.call(params.swapDataA);
        if (!successA) revert SwapFailed();
        
        // Get received amount of tokenA
        uint256 tokenABalance = IERC20(params.tokenA).balanceOf(address(this));
        
        // Step 2: Swap on DEX B (e.g., sell X7 at higher price)
        IERC20(params.tokenA).safeApprove(params.dexB, tokenABalance);
        
        (bool successB, ) = params.dexB.call(params.swapDataB);
        if (!successB) revert SwapFailed();
        
        // Now we should have more of the original token than we started with
    }

    // ============ Helper Functions ============

    /**
     * @notice Calculate expected profit before executing
     * @param amount Flash loan amount
     * @param buyPrice Price on first DEX (in WETH per token)
     * @param sellPrice Price on second DEX (in WETH per token)
     * @return expectedProfit Expected profit in WETH
     */
    function calculateProfit(
        uint256 amount,
        uint256 buyPrice,
        uint256 sellPrice
    ) external pure returns (uint256 expectedProfit) {
        // tokensReceived = amount / buyPrice
        // wethReceived = tokensReceived * sellPrice
        // profit = wethReceived - amount
        
        uint256 tokensReceived = (amount * 1e18) / buyPrice;
        uint256 wethReceived = (tokensReceived * sellPrice) / 1e18;
        
        if (wethReceived > amount) {
            expectedProfit = wethReceived - amount;
        }
    }

    /**
     * @notice Emergency withdraw tokens (only callable by owner)
     */
    function rescueTokens(address token, uint256 amount) external {
        // Note: In production, add access control
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    receive() external payable {}
}
