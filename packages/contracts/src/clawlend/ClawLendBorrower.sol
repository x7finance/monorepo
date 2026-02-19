// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IClawLend {
    function flashLoan(
        address receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external;
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

// Example implementation for AI agents
// Agents should inherit from this and override executeStrategy()
abstract contract ClawLendBorrower is IClawLendBorrower {
    address public immutable CLAWLEND;
    address public immutable TOKEN;
    
    bytes32 public constant CALLBACK_SUCCESS = keccak256("IClawLendBorrower.onFlashLoan");
    
    event StrategyExecuted(
        address indexed initiator,
        uint256 amount,
        uint256 profit,
        uint256 fee
    );
    
    error OnlyClawLend();
    error StrategyFailed();
    error InsufficientProfit();
    
    modifier onlyClawLend() {
        if (msg.sender != CLAWLEND) revert OnlyClawLend();
        _;
    }
    
    constructor(address _clawLend, address _token) {
        CLAWLEND = _clawLend;
        TOKEN = _token;
    }
    
    /// @notice Request a flash loan
    /// @param amount Amount to borrow
    /// @param data Strategy-specific data
    function borrow(uint256 amount, bytes calldata data) external {
        IClawLend(CLAWLEND).flashLoan(
            address(this),
            TOKEN,
            amount,
            data
        );
    }
    
    /// @notice Callback from ClawLend
    /// This is called after the loan is transferred
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external override onlyClawLend returns (bytes32) {
        // Execute the agent's strategy
        uint256 profit = _executeStrategy(initiator, token, amount, fee, data);
        
        // Verify we made enough profit to cover fee
        uint256 totalRepayment = amount + fee;
        uint256 balance = IERC20(token).balanceOf(address(this));
        
        if (balance < totalRepayment) revert InsufficientProfit();
        
        // Approve ClawLend to pull repayment
        IERC20(token).approve(CLAWLEND, totalRepayment);
        
        emit StrategyExecuted(initiator, amount, profit, fee);
        
        return CALLBACK_SUCCESS;
    }
    
    /// @notice Override this to implement your strategy
    /// @return profit Amount of profit made (after fee)
    function _executeStrategy(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) internal virtual returns (uint256 profit);
}

// Example: Simple Arbitrage Bot
contract ArbitrageBot is ClawLendBorrower {
    address public immutable DEX_A;
    address public immutable DEX_B;
    
    constructor(
        address _clawLend,
        address _token,
        address _dexA,
        address _dexB
    ) ClawLendBorrower(_clawLend, _token) {
        DEX_A = _dexA;
        DEX_B = _dexB;
    }
    
    function _executeStrategy(
        address, // initiator
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata // data
    ) internal override returns (uint256 profit) {
        uint256 startBalance = IERC20(token).balanceOf(address(this));
        
        // Example arbitrage logic:
        // 1. Buy low on DEX A
        // 2. Sell high on DEX B
        // 3. Keep profit
        
        // This is a placeholder - implement your actual strategy
        // IERC20(token).approve(DEX_A, amount);
        // IDEX(DEX_A).swap(token, otherToken, amount);
        // IDEX(DEX_B).swap(otherToken, token, amount);
        
        uint256 endBalance = IERC20(token).balanceOf(address(this));
        require(endBalance > startBalance + fee, "Not profitable");
        
        profit = endBalance - startBalance - fee;
    }
}

// Example: Liquidation Bot
contract LiquidationBot is ClawLendBorrower {
    address public immutable LENDING_PROTOCOL;
    
    constructor(
        address _clawLend,
        address _token,
        address _lendingProtocol
    ) ClawLendBorrower(_clawLend, _token) {
        LENDING_PROTOCOL = _lendingProtocol;
    }
    
    function _executeStrategy(
        address,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) internal override returns (uint256 profit) {
        // Decode liquidation parameters from data
        (address user, address collateral) = abi.decode(data, (address, address));
        
        uint256 startBalance = IERC20(token).balanceOf(address(this));
        
        // Example liquidation logic:
        // 1. Use borrowed funds to repay user's loan
        // 2. Receive collateral at discount
        // 3. Swap collateral back to loan token
        // 4. Repay flash loan + fee
        // 5. Keep liquidation reward as profit
        
        // This is a placeholder - implement your actual strategy
        // IERC20(token).approve(LENDING_PROTOCOL, amount);
        // ILendingProtocol(LENDING_PROTOCOL).liquidate(user, collateral, amount);
        // IDEX.swap(collateral, token, collateralAmount);
        
        uint256 endBalance = IERC20(token).balanceOf(address(this));
        require(endBalance > startBalance + fee, "Liquidation not profitable");
        
        profit = endBalance - startBalance - fee;
    }
}
