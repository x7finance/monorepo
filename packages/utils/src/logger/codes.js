export { LogCodes };
var LogCodes;
(function (LogCodes) {
    // General Operations
    LogCodes["SUCCESS"] = "Success";
    LogCodes["FAIL"] = "Fail";
    LogCodes["METRIC"] = "Metric";
    LogCodes["RETRY"] = "Retry";
    LogCodes["NOT_FOUND"] = "Not Found";
    LogCodes["INVALID_INPUT"] = "Invalid Input";
    LogCodes["NO_SWAP_NEEDED"] = "No Swap Needed";
    LogCodes["CACHE_HIT"] = "Cache Hit";
    LogCodes["CACHE_MISS"] = "Cache Miss";
    LogCodes["GET_BLOCK"] = "Get Block";
    LogCodes["ROLLBACK"] = "Rollback";
    // Subgraph Operations
    LogCodes["SUBGRAPH_V2_CACHE_HIT"] = "SubgraphV2 Cache Hit";
    LogCodes["SUBGRAPH_V2_CACHE_MISS"] = "SubgraphV2 Cache Miss";
    LogCodes["SUBGRAPH_V3_CACHE_HIT"] = "SubgraphV3 Cache Hit";
    LogCodes["SUBGRAPH_V3_CACHE_MISS"] = "SubgraphV3 Cache Miss";
    // Trade Operations
    LogCodes["NEW_TRADE"] = "New Trade";
    LogCodes["SWAP_QUOTE"] = "Swap Quote";
    LogCodes["NO_QUOTE"] = "No Quote";
    LogCodes["TRADE_ROUTES"] = "Trade Routes";
    LogCodes["TRADE_SPLITS"] = "Trade Splits";
    LogCodes["TRADE_REBUILD"] = "Trade Rebuild";
    LogCodes["FORCE_MIXED_ROUTES"] = "Force Mixed Routes";
    LogCodes["QUOTE_DIFF"] = "Quote Difference";
    LogCodes["FAILED_QUOTES"] = "Failed Quotes";
    LogCodes["NO_ROUTE_WITH_ZERO_SPLITS"] = "No Route with Zero Splits";
    LogCodes["FETCHING_QUOTES"] = "Fetching Quotes";
    LogCodes["DROPPING_QUOTE"] = "Dropping Quote";
    // Pool Operations
    LogCodes["GET_POOL_ADDRESSES"] = "Get Pool Addresses";
    LogCodes["FETCHING_POOLS"] = "Fetching Pools";
    LogCodes["FETCHING_SUBGRAPH_POOLS"] = "Fetching Subgraph Pools";
    LogCodes["POOL_ADDRESS_CACHE"] = "Pool Address Cache";
    LogCodes["LIQUIDITY_ADD"] = "Liquidity Add";
    LogCodes["RESERVES_FETCH_FAIL"] = "Reserves Fetch Fail";
    LogCodes["SUBGRAPH_INDEXING_ERROR"] = "Subgraph Indexing Error";
    LogCodes["NO_FOUND_POOLS"] = "No Found Pools";
    // Token Operations
    LogCodes["TOKEN_LIST_FAIL"] = "Token List Fail";
    LogCodes["TOKEN_FETCH_ERROR"] = "Token Fetch Error";
    LogCodes["TOKEN_PROPERTIES_MAP"] = "Token Properties Map";
    LogCodes["TOKEN_VALIDATOR"] = "Token Validator";
    LogCodes["CURRENCY_INPUT_CHAIN_MISMATCH"] = "Currency Input Chain Mismatch";
    // Simulation Operations
    LogCodes["SIMULATE"] = "Simulate";
    LogCodes["SIMULATE_SWAP_ROUTE"] = "Simulate Swap Route";
    LogCodes["SKIPPING_SIMULATION"] = "Skipping Simulation";
    LogCodes["COMPUTE_ALL_ROUTES"] = "Compute All Routes";
    LogCodes["SWAP_AND_ADD_PARAMETERS"] = "Swap and Add Parameters";
    // Routing Operations
    LogCodes["ROUTING_CONFIG"] = "Routing Config";
    // Approval Operations
    LogCodes["APPROVAL_FAIL"] = "Approval Fail";
    LogCodes["CHECK_PERMIT"] = "Check Permit";
    // Gas and Fees
    LogCodes["GAS_ESTIMATE"] = "Gas Estimate";
    // Error Handling
    LogCodes["WATCH_BLOCK_NUMBER_ERROR"] = "Watch Block Number Error";
    // Miscellaneous
    LogCodes["LOAN_INFO"] = "Loan Info";
    LogCodes["ABORTED"] = "Aborted";
    LogCodes["PRICE_IMPACT"] = "Price Impact";
    // UI Operations
    LogCodes["UI_FORM_VALIDATION"] = "UI Form Validation";
    LogCodes["UI_STATE_UPDATE"] = "UI State Update";
    // Query Operations
    LogCodes["QUERY_ERROR"] = "Query Error";
    LogCodes["QUERY_SUCCESS"] = "Query Success";
    // Transaction Operations
    LogCodes["TX_SIMULATION"] = "Transaction Simulation";
    LogCodes["TX_SIMULATION_FAIL"] = "Transaction Simulation Failed";
    LogCodes["TX_SUBMIT"] = "Transaction Submit";
    LogCodes["TX_CONFIRM"] = "Transaction Confirmed";
    LogCodes["TX_FAIL"] = "Transaction Failed";
    // Wallet Operations
    LogCodes["WALLET_CONNECT"] = "Wallet Connect";
    LogCodes["WALLET_DISCONNECT"] = "Wallet Disconnect";
    LogCodes["WALLET_ERROR"] = "Wallet Error";
    // IPFS Operations
    LogCodes["IPFS_UPLOAD"] = "IPFS Upload";
    LogCodes["IPFS_UPLOAD_FAIL"] = "IPFS Upload Failed";
    // XMTP Operations
    LogCodes["XMTP_INIT"] = "XMTP Init";
    LogCodes["XMTP_CONNECT"] = "XMTP Connect";
    LogCodes["XMTP_MESSAGE"] = "XMTP Message";
    LogCodes["XMTP_ERROR"] = "XMTP Error";
    // Liquidity Operations
    LogCodes["LIQUIDITY_REMOVE"] = "Liquidity Remove";
    LogCodes["LIQUIDITY_SYNC"] = "Liquidity Sync";
})(LogCodes || (LogCodes = {}));
//# sourceMappingURL=codes.js.map