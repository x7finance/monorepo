import type { Currency } from "@x7/utils"
import type { ApprovalState } from "~/lib/hooks/approvals/useTokenApproval"

export interface LoanTermData {
  readonly address: `0x${string}`
  readonly id: string
  readonly name: string
  readonly description: string
  readonly leverage: string
  readonly loanOriginationFee: string
  readonly loanRetentionPremium: string
  readonly principalRepaymentCondition: string
  readonly principalRepaymentDuring: boolean
  readonly color: string
  readonly loanSize: {
    min: number
    max: number
  }
  readonly loanLength: {
    min: number
    max: number
  }
}

export interface TokenApprovals {
  approval: ApprovalState
  amount: bigint
  address: `0x${string}`
  token: Currency | undefined
}

export type LoanTermDataMap = Readonly<Record<string, LoanTermData>>

export interface QuoteResponse {
  loanTerm: LoanTermData
  result: bigint[]
  error?: {
    message: string
    success: boolean
  }
  success: boolean
}

export interface RawQuoteResponse {
  status: string
  value: QuoteResponse
}

export interface LoanTokenState {
  loanToken: Currency | undefined
  collateralToken: Currency | undefined
  loanAmount: string
  collateralAmount: string
}

export interface LoanTokenActions {
  setLoanToken: (token: Currency) => void
  setCollateralToken: (token: Currency) => void
  setLoanAmount: (amount: string) => void
  setCollateralAmount: (amount: string) => void
}

export interface LoanTermsState {
  loanTerms: LoanTermDataMap
  loanDuration: number
  selectedLoan: LoanTermData | undefined
}

export interface LoanTermsActions {
  setLoanTerms: (terms: LoanTermDataMap) => void
  setLoanDuration: (duration: number) => void
  setLoan: (loan: LoanTermData | undefined) => void
}

export interface LoanQuotesState {
  quotes: RawQuoteResponse[]
  selectedQuote: QuoteResponse | undefined
  errors: { message: string; success: boolean }[]
  loadingQuotes: boolean
}

export interface LoanQuotesActions {
  setQuotes: (quotes: RawQuoteResponse[]) => void
  setSelectedQuote: (quote: QuoteResponse | undefined) => void
  setErrors: (errors: { message: string; success: boolean }[]) => void
  setLoadingQuotes: (loading: boolean) => void
  clearErrors: () => void
}

export interface LoanState {
  state: {
    errors: { message: string; success: boolean }[]
    quotes: RawQuoteResponse[]
    loanTerms: LoanTermDataMap
    loanDuration: number
    selectedQuote?: QuoteResponse
    selectedLoan?: LoanTermData
    loanToken: Currency
    collateralToken?: Currency
    loanAmount: string
    collateralAmount: string
    neededApprovals: TokenApprovals[]
  }
  mutate: {
    fetchQuotes: () => void
    setLoanDuration: (newLoanDuration: number) => void
    setSelectedQuote: (newQuote: QuoteResponse) => void
    setLoanToken: (newToken: Currency) => void
    setCollateralToken: (newToken: Currency) => void
    setLoan: (newLoanTerm: LoanTermData) => void
    setLoanAmount: (newAmount: string) => void
    setCollateralAmount: (newAmount: string) => void
  }
  loaders: {
    loadingQuotes: boolean
  }
}
