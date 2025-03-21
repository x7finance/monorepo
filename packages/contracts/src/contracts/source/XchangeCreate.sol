// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

import "./XchangeToken.sol";

/*

 /$$   /$$ /$$$$$$$$       /$$$$$$$$ /$$
| $$  / $$|_____ $$/      | $$_____/|__/
|  $$/ $$/     /$$/       | $$       /$$ /$$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$
 \  $$$$/     /$$/        | $$$$$   | $$| $$__  $$ |____  $$| $$__  $$ /$$_____/ /$$__  $$
  >$$  $$    /$$/         | $$__/   | $$| $$  \ $$  /$$$$$$$| $$  \ $$| $$      | $$$$$$$$
 /$$/\  $$  /$$/          | $$      | $$| $$  | $$ /$$__  $$| $$  | $$| $$      | $$_____/
| $$  \ $$ /$$/           | $$      | $$| $$  | $$|  $$$$$$$| $$  | $$|  $$$$$$$|  $$$$$$$
|__/  |__/|__/            |__/      |__/|__/  |__/ \_______/|__/  |__/ \_______/ \_______/

Contract: XchangeCreate

This contract is a token creation contract that is used to create new tokens with the liquidity injection of from X7 Lending Pool.

The following are the only functions that can be called on the XchangeCreate contract that affect the contract:

    function setFactory(address _factory) external onlyOwner {
        if (_factory == address(0)) revert ZeroAddress("factoryAddress");
        if (_factory == address(this)) revert InvalidAddress("Invalid address: this contract", address(this));

        address oldAddress = factory;
        router = _factory;

        emit AddressSet(oldAddress, _factory);
    }

    function setLendingPool(address _lendingPool) external onlyOwner {
        if (_lendingPool == address(0)) revert ZeroAddress("lendingPool");
        if (_lendingPool == address(this))
            revert InvalidAddress("Invalid address: this contract", address(this));

        address oldAddress = lendingPool;
        lendingPool = _lendingPool;

        emit AddressSet(oldAddress, _lendingPool);
    }

    function setRouter(address _router) external onlyOwner {
        if (_router == address(0)) revert ZeroAddress("routerAddress");
        if (_router == address(this)) revert InvalidAddress("Invalid address: this contract", address(this));

        address oldAddress = router;
        router = _router;

        emit AddressSet(oldAddress, _router);
    }

This contract will NOT be renounced.

*/

interface IX7InitialLiquidityLoanTerm {}

interface IXchangeFactory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    function createPair(address tokenA, address tokenB) external returns (address pair);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface ILendingPool {
    function availableCapital() external view returns (uint256);
    function getInitialLiquidityLoan(
        address tokenAddress,
        uint256 tokenAmount,
        address loanTermContract,
        uint256 loanAmount,
        uint256 loanDurationSeconds,
        address liquidityReceiver,
        uint256 deadline
    ) external payable returns (uint256 loanID);

    function getDiscountedQuote(
        address borrower,
        IX7InitialLiquidityLoanTerm loanTerm,
        uint256 loanAmount,
        uint256 loanDurationSeconds
    ) external view returns (uint256[7] memory);

    function liquidationReward() external view returns (uint256);
}

interface IXchangeV2Router {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

    function WETH() external pure returns (address);
}

interface IWETH {
    function withdraw(uint) external;
}

contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract XchangeCreate is Ownable, ReentrancyGuard {
    error ApprovalFailed(address token, address spender, uint256 amount);
    error EmptyString(string parameter);
    error ZeroAddress(string parameter);
    error InvalidAddress(string parameter, address addressValue);
    error InvalidAmount(string parameter, uint256 amount);
    error InvalidTimestamp(uint256 provided, uint256 current);
    error WithdrawFailed(string parameter, bool success);

    event TokenDeployed(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 supply,
        address newOwner,
        uint256 loanID
    );
    event AddressSet(address oldAddress, address newAddress);

    address public factory;
    address public lendingPoolAddress;
    address public router;

    struct TokenDeploymentParamsWithLoan {
        string name;
        string symbol;
        uint256 supply;
        uint8 teamTokens;
        address newOwner;
        address loanTermContract;
        uint256 loanAmount;
        uint256 loanDurationSeconds;
        address liquidityReceiver;
        uint256 deadline;
    }

    struct TokenDeploymentParamsWithoutLoan {
        string name;
        string symbol;
        uint256 supply;
        uint8 teamTokens;
        address newOwner;
        uint256 slippageTolerance;
        uint256 deadline;
    }

    constructor(address _factory, address _lendingPoolAddress, address _router) {
        factory = _factory;
        lendingPoolAddress = _lendingPoolAddress;
        router = _router;
        
    }

    receive() external payable {}

    function deployTokenWithLoan(TokenDeploymentParamsWithLoan memory params) external payable nonReentrant returns (address) {
        validateInputsWithLoan(params);

        uint256 tokenSupply = params.supply * 10 ** 18;
        uint256 teamTokenAmount = (tokenSupply / 100) * params.teamTokens;
        uint256 loanTokenAmount = tokenSupply - teamTokenAmount;

        XchangeToken token = new XchangeToken(params.name, params.symbol, tokenSupply, address(this));
        bool success = token.approve(lendingPoolAddress, loanTokenAmount);
        if (!success) {
            revert ApprovalFailed(address(token), lendingPoolAddress, loanTokenAmount);
        }

        uint256 loanID = initiateLoan(
            token,
            loanTokenAmount,
            params.loanTermContract,
            params.loanAmount,
            params.loanDurationSeconds,
            params.liquidityReceiver,
            params.deadline
        );

        token.transferOwnership(params.newOwner);

        if (teamTokenAmount > 0) {
            token.transfer(params.newOwner, teamTokenAmount);
        }

        emit TokenDeployed(address(token), params.name, params.symbol, tokenSupply, params.newOwner, loanID);

        return address(token);
    }

    function deployTokenWithoutLoan(
        TokenDeploymentParamsWithoutLoan memory params
    ) 
        external 
        payable 
        nonReentrant 
        returns (address) 
    {
        validateInputsWithoutLoan(params);

        uint256 tokenSupply = params.supply * 10 ** 18;
        uint256 teamTokenAmount = (tokenSupply / 100) * params.teamTokens;
        uint256 loanTokenAmount = tokenSupply - teamTokenAmount;

        XchangeToken token = new XchangeToken(params.name, params.symbol, tokenSupply, address(this));
        token.transferOwnership(params.newOwner);

        if (teamTokenAmount > 0) {
            token.transfer(params.newOwner, teamTokenAmount);
        }

        require(token.approve(router, loanTokenAmount), "Token approval failed");

        uint256 slippageFactor = 100 - params.slippageTolerance;

        uint256 loanTokenMin = (loanTokenAmount * slippageFactor) / 100;
        uint256 ethMin = (msg.value * slippageFactor) / 100;

        IXchangeV2Router(router).addLiquidityETH{value: msg.value}(
            address(token),
            loanTokenAmount,
            loanTokenMin,
            ethMin,
            params.newOwner,
            params.deadline
        );

        emit TokenDeployed(address(token), params.name, params.symbol, tokenSupply, params.newOwner, 0);

        return address(token);
    }

    function setFactory(address _factory) external onlyOwner {
        if (_factory == address(0)) revert ZeroAddress("factoryAddress");
        if (_factory == address(this)) revert InvalidAddress("Invalid address: this contract", address(this));

        address oldAddress = factory;
        router = _factory;

        emit AddressSet(oldAddress, _factory);
    }

    function setLendingPool(address _lendingPoolAddress) external onlyOwner {
        if (_lendingPoolAddress == address(0)) revert ZeroAddress("lendingPoolAddress");
        if (_lendingPoolAddress == address(this))
            revert InvalidAddress("Invalid address: this contract", address(this));

        address oldAddress = lendingPoolAddress;
        lendingPoolAddress = _lendingPoolAddress;

        emit AddressSet(oldAddress, _lendingPoolAddress);
    }

    function setRouter(address _router) external onlyOwner {
        if (_router == address(0)) revert ZeroAddress("routerAddress");
        if (_router == address(this)) revert InvalidAddress("Invalid address: this contract", address(this));

        address oldAddress = router;
        router = _router;

        emit AddressSet(oldAddress, _router);
    }

    function withdrawStuckETH() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert InvalidAmount("No ETH to withdraw", balance);
        (bool success, ) = msg.sender.call{ value: balance }("");
        if (!success) revert WithdrawFailed("ETH withdraw failed", success);
    }

    function rescueWETH() external {
        address wethAddress = IXchangeV2Router(router).WETH();
        IWETH(wethAddress).withdraw(IERC20(wethAddress).balanceOf(address(this)));
    }

    function validateInputsWithLoan(TokenDeploymentParamsWithLoan memory params) internal view {
        if (params.supply == 0 || params.supply * 10 ** 18 > type(uint256).max / 10 ** 18)
            revert InvalidAmount("tokenSupply", params.supply);
        if (bytes(params.name).length == 0 || bytes(params.symbol).length == 0) revert EmptyString("name or symbol");
        if (params.newOwner == address(0)) revert ZeroAddress("newOwner");
        if (params.loanTermContract == address(0)) revert ZeroAddress("loanTermContract");
        if (params.loanAmount == 0) revert InvalidAmount("loanAmount", params.loanAmount);
        if (params.loanDurationSeconds == 0) revert InvalidAmount("loanDurationSeconds", params.loanDurationSeconds);
        if (params.liquidityReceiver == address(0)) revert ZeroAddress("liquidityReceiver");
        if (params.deadline <= block.timestamp) revert InvalidTimestamp(params.deadline, block.timestamp);
        if (params.teamTokens > 90) revert InvalidAmount("teamTokens", params.teamTokens);
    }

    function validateInputsWithoutLoan(TokenDeploymentParamsWithoutLoan memory params) internal view {
    if (params.supply == 0 || params.supply * 10 ** 18 > type(uint256).max / 10 ** 18)
        revert InvalidAmount("tokenSupply", params.supply);
    if (bytes(params.name).length == 0 || bytes(params.symbol).length == 0) revert EmptyString("name or symbol");
    if (params.newOwner == address(0)) revert ZeroAddress("newOwner");
    if (params.deadline <= block.timestamp) revert InvalidTimestamp(params.deadline, block.timestamp);
    if (params.teamTokens > 90) revert InvalidAmount("teamTokens", params.teamTokens);
}

    function initiateLoan(
        XchangeToken token,
        uint256 loanTokenAmount,
        address loanTermContract,
        uint256 loanAmount,
        uint256 loanDurationSeconds,
        address liquidityReceiver,
        uint256 deadline
    ) internal returns (uint256) {
        ILendingPool lendingPool = ILendingPool(lendingPoolAddress);
        uint256[7] memory quote = lendingPool.getDiscountedQuote(
            address(this),
            IX7InitialLiquidityLoanTerm(loanTermContract),
            loanAmount,
            loanDurationSeconds
        );

        uint256 originationFee = quote[3];
        uint256 liquidationReward = lendingPool.liquidationReward();

        if (originationFee + liquidationReward > lendingPool.availableCapital())
            revert InvalidAmount("Insufficient available capital", originationFee + liquidationReward);

        if (originationFee + liquidationReward > msg.value)
            revert InvalidAmount("Insufficient ETH", originationFee + liquidationReward);

        return
            lendingPool.getInitialLiquidityLoan{ value: msg.value }(
                address(token),
                loanTokenAmount,
                loanTermContract,
                loanAmount,
                loanDurationSeconds,
                liquidityReceiver,
                deadline
            );
    }
}