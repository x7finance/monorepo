export type LoanType = "001" | "003" | "004" | "005";

export enum Implementation {
  XCHANGE = "XCHANGE",
  UNISWAP = "UNISWAP",
  AERODROME = "AERODROME",
  SUSHISWAP = "SUSHISWAP",
  PANCAKESWAP = "PANCAKESWAP",
  MIXED = "MIXED",
  // OXL = "OXL",
}

export enum Protocol {
  V2 = "V2",
  V3 = "V3",
  MIXED = "MIXED",
}
