// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockLendingPool
 * @notice Mock lending pool for testing ClawLendFlashLoan
 * @dev Simulates the IX7LendingPool interface with authorized flash loan contract
 */
contract MockLendingPool {
    using SafeERC20 for IERC20;

    address public token;
    address public flashLoanContract;

    constructor(address _token) {
        token = _token;
    }

    function setFlashLoanContract(address _flashLoan) external {
        flashLoanContract = _flashLoan;
    }

    function deposit(address _token, uint256 amount) external {
        // Flash loan contract is authorized to deposit without transferFrom
        // (simulates real pool where flash loan has special permissions)
        if (msg.sender == flashLoanContract) {
            // Just pull the tokens - flash loan already has them
            IERC20(_token).safeTransferFrom(msg.sender, address(this), amount);
        } else {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), amount);
        }
    }

    function withdraw(address _token, uint256 amount) external {
        IERC20(_token).safeTransfer(msg.sender, amount);
    }

    function getAvailableLiquidity(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }
}
