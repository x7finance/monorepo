// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Import the base borrower contract from ClawLend
import "@x7/contracts/src/clawlend/ClawLendBorrower.sol";

/**
 * @title X7EcosystemArbitrage
 * @notice Arbitrage bot optimized for X7 Finance ecosystem
 * @dev Exploits price differences between Xchange DEX and external DEXs
 *
 * X7 ECOSYSTEM ADVANTAGES:
 * - Native Xchange DEX integration
 * - Lower fees for X7 token holders
 * - Deep liquidity for X7 ecosystem tokens
 * - Flash loan from ClawLend with 0% fee
 *
 * SUPPORTED PAIRS:
 * - X7D/WETH
 * - X7R/WETH
 * - X7100/WETH
 * - X7DAO/WETH
 */
contract X7EcosystemArbitrage is ClawLendBorrower {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    
    // Xchange DEX Router
    address public constant XCHANGE_ROUTER = 0x0000000000000000000000000000000000000000; // TODO: Update
    
    // X7 Token Addresses (Base)
    address public constant X7D = 0x0000000000000000000000000000000000000000; // TODO: Update
    address public constant X7R = 0x0000000000000000000000000000000000000000; // TODO: Update
    address public constant X7100 = 0x0000000000000000000000000000000000000000; // TODO: Update
    address public constant X7DAO = 0x0000000000000000000000000000000000000000; // TODO: Update

    // ============ Errors ============
    error InvalidToken();
    error XchangeSwapFailed();
    error ExternalSwapFailed();
    error ProfitBelowThreshold();

    // ============ Events ============
    event X7ArbitrageExecuted(
        address indexed x7Token,
        address indexed externalDex,
        uint256 amountIn,
        uint256 profit,
        string arbitrageType
    );

    // ============ Structs ============
    struct X7ArbitrageParams {
        address x7Token;           // X7 ecosystem token to arbitrage
        address externalDex;       // External DEX router (Uniswap, Aerodrome, etc.)
        bool buyOnXchange;         // true = buy on Xchange, sell on external
        uint256 minProfit;         // Minimum profit threshold
        bytes xchangeSwapData;     // Xchange swap calldata
        bytes externalSwapData;    // External DEX swap calldata
    }

    // ============ Constructor ============
    constructor(
        address _clawLend,
        address _weth
    ) ClawLendBorrower(_clawLend, _weth) {}

    // ============ Strategy Implementation ============

    /**
     * @notice Execute X7 ecosystem arbitrage
     * @param initiator Address that initiated the flash loan
     * @param token Token borrowed (WETH)
     * @param amount Amount borrowed
     * @param fee Flash loan fee (0 for ClawLend)
     * @param data Encoded X7ArbitrageParams
     * @return profit Net profit after repaying loan
     */
    function _executeStrategy(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) internal override returns (uint256 profit) {
        X7ArbitrageParams memory params = abi.decode(data, (X7ArbitrageParams));
        
        // Validate token is in X7 ecosystem
        if (!_isX7Token(params.x7Token)) revert InvalidToken();
        
        uint256 startBalance = IERC20(token).balanceOf(address(this));
        
        if (params.buyOnXchange) {
            // Buy on Xchange (lower price), sell on external (higher price)
            _arbitrageBuyXchange(token, params.x7Token, amount, params);
        } else {
            // Buy on external (lower price), sell on Xchange (higher price)
            _arbitrageSellXchange(token, params.x7Token, amount, params);
        }
        
        // Calculate profit
        uint256 endBalance = IERC20(token).balanceOf(address(this));
        uint256 totalRepayment = amount + fee;
        
        if (endBalance < totalRepayment + params.minProfit) {
            revert ProfitBelowThreshold();
        }
        
        profit = endBalance - totalRepayment;
        
        emit X7ArbitrageExecuted(
            params.x7Token,
            params.externalDex,
            amount,
            profit,
            params.buyOnXchange ? "BUY_ON_XCHANGE" : "SELL_ON_XCHANGE"
        );
        
        return profit;
    }

    /**
     * @notice Buy on Xchange, sell on external DEX
     */
    function _arbitrageBuyXchange(
        address weth,
        address x7Token,
        uint256 amount,
        X7ArbitrageParams memory params
    ) internal {
        // Step 1: Buy X7 token on Xchange
        IERC20(weth).safeApprove(XCHANGE_ROUTER, amount);
        
        (bool successXchange, ) = XCHANGE_ROUTER.call(params.xchangeSwapData);
        if (!successXchange) revert XchangeSwapFailed();
        
        // Get X7 token balance
        uint256 x7Balance = IERC20(x7Token).balanceOf(address(this));
        
        // Step 2: Sell X7 token on external DEX
        IERC20(x7Token).safeApprove(params.externalDex, x7Balance);
        
        (bool successExternal, ) = params.externalDex.call(params.externalSwapData);
        if (!successExternal) revert ExternalSwapFailed();
    }

    /**
     * @notice Buy on external DEX, sell on Xchange
     */
    function _arbitrageSellXchange(
        address weth,
        address x7Token,
        uint256 amount,
        X7ArbitrageParams memory params
    ) internal {
        // Step 1: Buy X7 token on external DEX
        IERC20(weth).safeApprove(params.externalDex, amount);
        
        (bool successExternal, ) = params.externalDex.call(params.externalSwapData);
        if (!successExternal) revert ExternalSwapFailed();
        
        // Get X7 token balance
        uint256 x7Balance = IERC20(x7Token).balanceOf(address(this));
        
        // Step 2: Sell X7 token on Xchange
        IERC20(x7Token).safeApprove(XCHANGE_ROUTER, x7Balance);
        
        (bool successXchange, ) = XCHANGE_ROUTER.call(params.xchangeSwapData);
        if (!successXchange) revert XchangeSwapFailed();
    }

    // ============ View Functions ============

    /**
     * @notice Check if token is part of X7 ecosystem
     */
    function _isX7Token(address token) internal pure returns (bool) {
        return token == X7D || token == X7R || token == X7100 || token == X7DAO;
    }

    /**
     * @notice Calculate arbitrage opportunity between Xchange and external DEX
     * @param xchangePrice Price on Xchange (in WETH per token, scaled by 1e18)
     * @param externalPrice Price on external DEX (in WETH per token, scaled by 1e18)
     * @param amount Amount to arbitrage (in WETH)
     * @return profit Expected profit in WETH
     * @return buyOnXchange true if buying on Xchange is profitable
     */
    function calculateArbitrage(
        uint256 xchangePrice,
        uint256 externalPrice,
        uint256 amount
    ) external pure returns (uint256 profit, bool buyOnXchange) {
        // Calculate tokens received from each DEX
        uint256 tokensFromXchange = (amount * 1e18) / xchangePrice;
        uint256 tokensFromExternal = (amount * 1e18) / externalPrice;
        
        // Calculate WETH received from selling on opposite DEX
        uint256 wethFromXchange = (tokensFromExternal * xchangePrice) / 1e18;
        uint256 wethFromExternal = (tokensFromXchange * externalPrice) / 1e18;
        
        // Determine better direction
        if (wethFromExternal > amount && wethFromExternal >= wethFromXchange) {
            profit = wethFromExternal - amount;
            buyOnXchange = true;
        } else if (wethFromXchange > amount) {
            profit = wethFromXchange - amount;
            buyOnXchange = false;
        } else {
            profit = 0;
            buyOnXchange = false;
        }
    }

    /**
     * @notice Get all supported X7 tokens
     */
    function getSupportedTokens() external pure returns (address[] memory) {
        address[] memory tokens = new address[](4);
        tokens[0] = X7D;
        tokens[1] = X7R;
        tokens[2] = X7100;
        tokens[3] = X7DAO;
        return tokens;
    }

    // ============ Emergency Functions ============

    function rescueTokens(address token, uint256 amount) external {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    receive() external payable {}
}
