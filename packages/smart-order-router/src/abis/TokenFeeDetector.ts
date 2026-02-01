export const tokenFeeDetectorABI = [
  { inputs: [], name: "PairLookupFailed", type: "error" },
  { inputs: [], name: "SameToken", type: "error" },
  {
    inputs: [],
    name: "BPS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address[]", name: "tokens", type: "address[]" },
          { internalType: "address", name: "baseToken", type: "address" },
          { internalType: "uint256", name: "amountToBorrow", type: "uint256" },
          { internalType: "address", name: "factory", type: "address" },
          { internalType: "bytes32", name: "initCodeHash", type: "bytes32" },
        ],
        internalType: "struct BatchValidate",
        name: "validateData",
        type: "tuple",
      },
    ],
    name: "batchValidate",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "buyFeeBps", type: "uint256" },
          { internalType: "uint256", name: "sellFeeBps", type: "uint256" },
        ],
        internalType: "struct TokenFees[]",
        name: "fotResults",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "address", name: "baseToken", type: "address" },
          { internalType: "uint256", name: "amountToBorrow", type: "uint256" },
          { internalType: "address", name: "factory", type: "address" },
          { internalType: "bytes32", name: "initCodeHash", type: "bytes32" },
        ],
        internalType: "struct Validate",
        name: "validateData",
        type: "tuple",
      },
    ],
    name: "validate",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "buyFeeBps", type: "uint256" },
          { internalType: "uint256", name: "sellFeeBps", type: "uint256" },
        ],
        internalType: "struct TokenFees",
        name: "fotResult",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "xchangeV2Call",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
