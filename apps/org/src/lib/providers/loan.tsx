/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { FC } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPublicClient } from "@wagmi/core";
import { parseUnits } from "viem";
import { useAccount, useChainId, useWaitForTransactionReceipt } from "wagmi";

import { X7LendingPoolV2 } from "@x7/contracts";
import { X7ContractsEnum } from "@x7/sdk";
import type { ChainId, Currency } from "@x7/utils";
import { CurrencyAmount, LogCodes, Native } from "@x7/utils";

import {
  ApprovalState,
  useTokenApproval,
} from "~/lib/hooks/approvals/useTokenApproval";
import { useCountOfActiveLoans } from "~/lib/hooks/loans/useXchangeLendingPoolData";
import { useWeb3Config } from "~/lib/providers/web3";
import type {
  LoanTermData,
  TokenApprovals,
} from "../../app/(xchange)/_components/loans/types";
import { useLoanTerms } from "../../app/(xchange)/_components/loans/types";
import { SECONDS_IN_A_DAY } from "../constants/misc";
import { log } from "../utils/log";

const MINIMUM_LOAN_AMOUNT = 0.5;
const MAXIMUM_LOAN_AMOUNT = 5.0;

export interface QuoteResponse {
  loanTerm: LoanTermData;
  result: bigint[];
  error?: {
    message: string;
    success: boolean;
  };
  success: boolean;
}

export interface RawQuoteResponse {
  status: string;
  value: QuoteResponse;
}

interface LoanState {
  state: {
    errors: {
      message: string;
      success: boolean;
    }[];
    quotes: any;
    loanTerms: Record<string, LoanTermData>;
    loanDuration: number;
    selectedQuote?: QuoteResponse;
    selectedLoan?: LoanTermData;
    loanToken: Currency;
    collateralToken?: Currency;
    loanAmount: string;
    collateralAmount: string;
    neededApprovals: TokenApprovals[];
  };
  mutate: {
    fetchQuotes: () => void;
    setLoanDuration: (newLoanDuration: number) => void;
    setSelectedQuote: (newQuote: QuoteResponse) => void;
    setLoanToken: (newToken: Currency) => void;
    setCollateralToken: (newToken: Currency) => void;
    setLoan: (newLoanTerm: LoanTermData) => void;
    setLoanAmount: (newAmount: string) => void;
    setCollateralAmount: (newAmount: string) => void;
  };
  loaders: {
    loadingQuotes: boolean;
  };
}

interface X7LoanStateProviderProps {
  children: React.ReactNode;
}

const X7LoanStateContext = createContext<LoanState>({} as LoanState);

export const X7LoanStateProvider: FC<X7LoanStateProviderProps> = ({
  children,
}) => {
  const chainId = useChainId() as ChainId;
  const { address } = useAccount();
  const { wagmiConfig } = useWeb3Config();

  const publicClient = getPublicClient(wagmiConfig);

  const loanTerms = useLoanTerms();
  const [loanDuration, setLoanDuration] = useState<number>(7);
  const [quotes, setQuotes] = useState<QuoteResponse[]>([]);
  const [selectedLoan, setLoan] = useState<LoanTermData | undefined>();

  const [selectedQuote, setSelectedQuote] = useState<QuoteResponse>();
  const [loadingQuotes, setLoadingQuotes] = useState<boolean>(false);
  const [loanHash, _setLoanHash] = useState<`0x${string}`>();
  const [errors, setErrors] = useState([]);
  const [collateralToken, _setCollateralToken] = useState<Currency>();
  const [loanToken, setLoanToken] = useState<Currency>(Native.onChain(chainId));
  const [collateralAmount, setCollateralAmount] = useState<string>("0.0");
  const [loanAmount, setLoanAmount] = useState<string>("0.5");

  const [collateralTokenApprovalState] = useTokenApproval({
    amount: CurrencyAmount.fromRawAmount(
      collateralToken ?? Native.onChain(chainId),
      parseUnits(collateralAmount, collateralToken?.decimals ?? 18),
    ),
    spender: X7ContractsEnum.X7_LendingPool(chainId),
    enabled: !!collateralToken && parseFloat(collateralAmount) > 0,
  });

  const [loanTokenApprovalState] = useTokenApproval({
    amount: CurrencyAmount.fromRawAmount(
      loanToken ?? Native.onChain(chainId),
      parseUnits(loanAmount, loanToken.decimals),
    ),
    spender: X7ContractsEnum.X7_LendingPool(chainId),
    enabled: !!loanToken && parseFloat(loanAmount) > 0,
  });

  const neededApprovals: TokenApprovals[] = [
    {
      token: loanToken,
      amount: parseUnits(loanAmount, loanToken.decimals ?? 18),
      address: X7ContractsEnum.X7_LendingPool(chainId),
      approval: loanTokenApprovalState,
    },
    {
      token: collateralToken,
      amount: parseUnits(collateralAmount, collateralToken?.decimals ?? 18),
      address: X7ContractsEnum.X7_LendingPool(chainId),
      approval: collateralTokenApprovalState,
    },
  ].filter((t) => {
    return t.approval !== ApprovalState.APPROVED;
  });

  const { countOfActiveLoans } = useCountOfActiveLoans(chainId);

  const sanityCheck = () => {
    setErrors([]);
    const sanityErrors: any = [];
    if (
      parseFloat(loanAmount) < MINIMUM_LOAN_AMOUNT &&
      parseFloat(loanAmount) > MAXIMUM_LOAN_AMOUNT
    ) {
      const errMessage = {
        message: "Loaned amount must be between 0.5ETH and 5.0ETH",
        error: "THRESHOLD_ERROR",
      };
      sanityErrors.push(errMessage);
    }

    if (!collateralToken) {
      const errMessage = {
        message: "Please select a collateral token",
        error: "NO_TOKEN_SELECTED",
      };
      sanityErrors.push(errMessage);
    }

    if (parseFloat(collateralAmount) <= 0) {
      const errMessage = {
        message: "Please enter a collateral amount",
        error: "AMOUNT_ZERO",
      };
      sanityErrors.push(errMessage);
    }

    if (!loanToken) {
      const errMessage = {
        message: "Please select a loan token",
        error: "NO_TOKEN_SELECTED",
      };
      sanityErrors.push(errMessage);
    }

    if (parseFloat(loanAmount) <= 0) {
      const errMessage = {
        message: "Please enter a loan amount",
        error: "AMOUNT_ZERO",
      };
      sanityErrors.push(errMessage);
    }

    setErrors(sanityErrors);

    return sanityErrors.length === 0;
  };

  const fetchQuotes = useCallback(() => {
    if (sanityCheck()) {
      setLoadingQuotes(true);
      setErrors([]);

      Promise.allSettled(
        Array.from({ length: countOfActiveLoans }, async (_, index) => {
          if (publicClient === undefined) {
            return;
          }

          const activeLoanTerms = await publicClient.readContract({
            abi: X7LendingPoolV2,
            address: X7ContractsEnum.X7_LendingPool(chainId),
            functionName: "activeLoanTerms",
            // @ts-expect-error: todo fix
            args: [index],
          });

          const _lt = loanTerms[`${activeLoanTerms}`];

          if (_lt) {
            return publicClient
              .readContract({
                abi: X7LendingPoolV2,
                address: X7ContractsEnum.X7_LendingPool(chainId),
                functionName: "getDiscountedQuote",
                args: [
                  // @ts-expect-error: todo fix
                  address,
                  activeLoanTerms,
                  parseUnits(loanAmount, loanToken.decimals),
                  BigInt(loanDuration * SECONDS_IN_A_DAY),
                ],
              })
              .then((response) => {
                return {
                  loanTerm: _lt,
                  result: response,
                  success: true,
                };
              })
              .catch((err) => {
                return {
                  loanTerm: _lt,
                  error: err,
                  success: false,
                };
              });
          } else {
            return Promise.resolve({
              loanTerm: null,
              result: null,
              success: false,
            });
          }
        }),
      )
        .then((responses: any) => {
          setLoadingQuotes(false);
          setQuotes(responses);
        })
        .catch((error) => {
          setLoadingQuotes(false);
          log.error(LogCodes.FAIL, `${error}`);
        });
    }
  }, [
    sanityCheck,
    setLoadingQuotes,
    setErrors,
    loanAmount,
    loanToken.decimals,
    loanDuration,
    address,
    chainId,
  ]);

  const { data: _ } = useWaitForTransactionReceipt({
    chainId,
    hash: loanHash,
    pollingInterval: 2_500,
    retryDelay: 2_500,
  });

  useEffect(() => {
    fetchQuotes();
  }, [loanAmount, loanToken, collateralAmount, collateralToken, loanDuration]);

  const setCollateralToken = useCallback<(value: Currency) => void>(
    (value) => {
      _setCollateralToken(value);
      setCollateralAmount("0");
      setQuotes([]);
    },
    [_setCollateralToken],
  );

  useEffect(() => {
    if (!!selectedLoan?.address && quotes.length > 0) {
      const matchingQuote = quotes.find((quote: any) => {
        return (
          quote.status === "fulfilled" &&
          quote.value?.loanTerm?.address === selectedLoan.address
        );
      });

      if (matchingQuote) {
        // @ts-expect-error: todo fix
        setSelectedQuote(matchingQuote.value);
      } else {
        console.warn("No matching quote found for selected loan");
      }
    }
  }, [quotes, selectedLoan, loadingQuotes]);

  const builtState = useMemo(
    () => ({
      state: {
        errors,
        quotes,
        loanDuration,
        loanTerms,
        selectedQuote,
        selectedLoan,
        loanToken,
        collateralToken,
        collateralAmount,
        loanAmount,
        neededApprovals,
      },
      mutate: {
        fetchQuotes,
        setLoanDuration,
        setSelectedQuote,
        setLoan,
        setCollateralToken,
        setLoanToken,
        setLoanAmount,
        setCollateralAmount,
      },
      loaders: {
        loadingQuotes,
      },
    }),
    [
      errors,
      quotes,
      loanDuration,
      loanTerms,
      selectedQuote,
      selectedLoan,
      loanToken,
      collateralToken,
      collateralAmount,
      loanAmount,
      neededApprovals,
      fetchQuotes,
      setLoanDuration,
      setSelectedQuote,
      setLoan,
      setCollateralToken,
      setLoanToken,
      setLoanAmount,
      setCollateralAmount,
      loadingQuotes,
    ],
  );

  return (
    <X7LoanStateContext.Provider value={builtState}>
      {children}
    </X7LoanStateContext.Provider>
  );
};

export const useLoanState = () => {
  const context = useContext(X7LoanStateContext);
  if (!context) {
    throw new Error("Hook can only be used inside Loan State Context");
  }

  return context;
};
