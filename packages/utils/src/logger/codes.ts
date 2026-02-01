export enum LogCodes {
  // General Operations
  SUCCESS = "Success",
  FAIL = "Fail",
  METRIC = "Metric",
  RETRY = "Retry",
  NOT_FOUND = "Not Found",
  INVALID_INPUT = "Invalid Input",
  NO_SWAP_NEEDED = "No Swap Needed",
  CACHE_HIT = "Cache Hit",
  CACHE_MISS = "Cache Miss",
  GET_BLOCK = "Get Block",
  ROLLBACK = "Rollback",

  // Subgraph Operations
  SUBGRAPH_V2_CACHE_HIT = "SubgraphV2 Cache Hit",
  SUBGRAPH_V2_CACHE_MISS = "SubgraphV2 Cache Miss",
  SUBGRAPH_V3_CACHE_HIT = "SubgraphV3 Cache Hit",
  SUBGRAPH_V3_CACHE_MISS = "SubgraphV3 Cache Miss",

  // Trade Operations
  NEW_TRADE = "New Trade",
  SWAP_QUOTE = "Swap Quote",
  NO_QUOTE = "No Quote",
  TRADE_ROUTES = "Trade Routes",
  TRADE_SPLITS = "Trade Splits",
  TRADE_REBUILD = "Trade Rebuild",
  FORCE_MIXED_ROUTES = "Force Mixed Routes",
  QUOTE_DIFF = "Quote Difference",
  FAILED_QUOTES = "Failed Quotes",
  NO_ROUTE_WITH_ZERO_SPLITS = "No Route with Zero Splits",
  FETCHING_QUOTES = "Fetching Quotes",
  DROPPING_QUOTE = "Dropping Quote",

  // Pool Operations
  GET_POOL_ADDRESSES = "Get Pool Addresses",
  FETCHING_POOLS = "Fetching Pools",
  FETCHING_SUBGRAPH_POOLS = "Fetching Subgraph Pools",
  POOL_ADDRESS_CACHE = "Pool Address Cache",
  LIQUIDITY_ADD = "Liquidity Add",
  RESERVES_FETCH_FAIL = "Reserves Fetch Fail",
  SUBGRAPH_INDEXING_ERROR = "Subgraph Indexing Error",
  NO_FOUND_POOLS = "No Found Pools",

  // Token Operations
  TOKEN_LIST_FAIL = "Token List Fail",
  TOKEN_FETCH_ERROR = "Token Fetch Error",
  TOKEN_PROPERTIES_MAP = "Token Properties Map",
  TOKEN_VALIDATOR = "Token Validator",
  CURRENCY_INPUT_CHAIN_MISMATCH = "Currency Input Chain Mismatch",

  // Simulation Operations
  SIMULATE = "Simulate",
  SIMULATE_SWAP_ROUTE = "Simulate Swap Route",
  SKIPPING_SIMULATION = "Skipping Simulation",
  COMPUTE_ALL_ROUTES = "Compute All Routes",
  SWAP_AND_ADD_PARAMETERS = "Swap and Add Parameters",

  // Routing Operations
  ROUTING_CONFIG = "Routing Config",

  // Approval Operations
  APPROVAL_FAIL = "Approval Fail",
  CHECK_PERMIT = "Check Permit",

  // Gas and Fees
  GAS_ESTIMATE = "Gas Estimate",

  // Error Handling
  WATCH_BLOCK_NUMBER_ERROR = "Watch Block Number Error",

  // Miscellaneous
  LOAN_INFO = "Loan Info",
  ABORTED = "Aborted",
  PRICE_IMPACT = "Price Impact",

  // UI Operations
  UI_FORM_VALIDATION = "UI Form Validation",
  UI_STATE_UPDATE = "UI State Update",

  // Query Operations
  QUERY_ERROR = "Query Error",
  QUERY_SUCCESS = "Query Success",

  // Transaction Operations
  TX_SIMULATION = "Transaction Simulation",
  TX_SIMULATION_FAIL = "Transaction Simulation Failed",
  TX_SUBMIT = "Transaction Submit",
  TX_CONFIRM = "Transaction Confirmed",
  TX_FAIL = "Transaction Failed",

  // Wallet Operations
  WALLET_CONNECT = "Wallet Connect",
  WALLET_DISCONNECT = "Wallet Disconnect",
  WALLET_ERROR = "Wallet Error",

  // IPFS Operations
  IPFS_UPLOAD = "IPFS Upload",
  IPFS_UPLOAD_FAIL = "IPFS Upload Failed",

  // XMTP Operations
  XMTP_INIT = "XMTP Init",
  XMTP_CONNECT = "XMTP Connect",
  XMTP_MESSAGE = "XMTP Message",
  XMTP_ERROR = "XMTP Error",

  // Liquidity Operations
  LIQUIDITY_REMOVE = "Liquidity Remove",
  LIQUIDITY_SYNC = "Liquidity Sync",
}
