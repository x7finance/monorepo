// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MockBorrower
 * @notice A mock flash loan receiver that properly repays
 */
contract MockBorrower {
    bytes32 public constant CALLBACK_SUCCESS = keccak256("IClawLendBorrower.onFlashLoan");

    address public immutable flashLoan;
    address public immutable token;

    constructor(address _flashLoan, address _token) {
        flashLoan = _flashLoan;
        token = _token;
    }

    function onFlashLoan(
        address initiator,
        address _token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        // Here you would do arbitrage, liquidation, etc.
        // For testing, we just approve repayment

        uint256 totalRepay = amount + fee;
        IERC20(_token).approve(msg.sender, totalRepay);

        return CALLBACK_SUCCESS;
    }
}

/**
 * @title BadBorrower
 * @notice Returns wrong callback value - loan should fail
 */
contract BadBorrower {
    address public immutable flashLoan;
    address public immutable token;

    constructor(address _flashLoan, address _token) {
        flashLoan = _flashLoan;
        token = _token;
    }

    function onFlashLoan(
        address initiator,
        address _token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        // Return wrong value
        return keccak256("WRONG");
    }
}

/**
 * @title NonRepayingBorrower
 * @notice Doesn't approve repayment - loan should fail
 */
contract NonRepayingBorrower {
    bytes32 public constant CALLBACK_SUCCESS = keccak256("IClawLendBorrower.onFlashLoan");

    address public immutable flashLoan;
    address public immutable token;

    constructor(address _flashLoan, address _token) {
        flashLoan = _flashLoan;
        token = _token;
    }

    function onFlashLoan(
        address initiator,
        address _token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        // Don't approve repayment - this should cause the loan to fail
        return CALLBACK_SUCCESS;
    }
}
