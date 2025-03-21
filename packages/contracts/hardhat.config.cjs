require("@nomicfoundation/hardhat-toolbox-viem");

const dotenv = require("dotenv");

dotenv.config();

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

const DEFAULT_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

const VERSION_FIVE_COMPILER_SETTINGS = {
  version: "0.5.16",
};

module.exports = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/`,
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/`,
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/`,
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/`,
    },
    bnb: {
      url: `https://bsc-dataseed.binance.org/`,
    },
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      "contracts/v3-periphery/NonfungiblePositionManager.sol":
        LOW_OPTIMIZER_COMPILER_SETTINGS,
      "contracts/v3-periphery/test/MockTimeNonfungiblePositionManager.sol":
        LOW_OPTIMIZER_COMPILER_SETTINGS,
      "contracts/v3-periphery/test/NFTDescriptorTest.sol":
        LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      "contracts/v3-periphery/NonfungibleTokenPositionDescriptor.sol":
        LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      "contracts/v3-periphery/libraries/NFTDescriptor.sol":
        LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      "contracts/v2-core/UniswapV2Pair.sol": VERSION_FIVE_COMPILER_SETTINGS,
      "contracts/v2-core/libraries/Math.sol": VERSION_FIVE_COMPILER_SETTINGS,
      "contracts/v2-core/UniswapV2Factory.sol": VERSION_FIVE_COMPILER_SETTINGS,
      "contracts/v2-core/UniswapV2ERC20.sol": VERSION_FIVE_COMPILER_SETTINGS,
      "contracts/v2-core/libraries/SafeMath.sol":
        VERSION_FIVE_COMPILER_SETTINGS,
      "contracts/v2-core/interfaces/IERC20.sol": VERSION_FIVE_COMPILER_SETTINGS,
      "contracts/v2-core/libraries/UQ112x112.sol":
        VERSION_FIVE_COMPILER_SETTINGS,
    },
  },
};
