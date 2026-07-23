export interface SavedToken {
  id: string
  chainId: number
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
  status: TokenStatus
}

export type TokenStatus = "UNKNOWN" | "APPROVED" | "DISAPPROVED"
