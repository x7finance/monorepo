/**
 * Loan State Store (Zustand)
 *
 * This replaces the old Context-based LoanStateProvider.
 * The `useLoanState()` hook provides backward compatibility.
 *
 * ROLLBACK: If you need to revert to the old Context provider,
 * see: ~/lib/providers/deprecated/README.md
 */
"use client";

import { useCallback, useEffect, useMemo } from "react";
import { getPublicClient } from "@wagmi/core";
import { parseUnits } from "viem";
import { useAccount, useChainId } from "wagmi";

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
import { log } from "~/lib/utils/log";
import { useLoanQuotesStore } from "./quotes";
import { useLoanTermsStore } from "./terms";
import { useLoanTokenStore } from "./tokens";
import type { LoanState, LoanTermDataMap, RawQuoteResponse, TokenApprovals } from "./types";

export { useLoanQuotesStore } from "./quotes";
export { useLoanTermsStore } from "./terms";
export { useLoanTokenStore } from "./tokens";
export type * from "./types";

export function useLoanTerms(): LoanTermDataMap {
  const chainId = useChainId() as ChainId;

  const LOAN_TERMS: LoanTermDataMap = useMemo(
    () => ({
      [X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId)]: {
        address: X7ContractsEnum.X7InitialLiquidityLoanTerm005(chainId),
        id: "005",
        name: "Fixed Origination Fee",
        description:
          "Where all fees are paid at launch and one final payment due before the end of the loan term.",
        leverage: "100x",
        loanOriginationFee: "0.01 ether (contract default) (100x leverage)",
        loanRetentionPremium: "0%",
        principalRepaymentCondition:
          "100% of borrowed capital due by the end of the loan term",
        principalRepaymentDuring: false,
        color: "emerald",
        loanSize: {
          min: 0.5,
          max: 5,
        },
        loanLength: {
          min: 1,
          max: 28,
        },
      },
    }),
    [chainId],
  );

  return LOAN_TERMS;
}

const MINIMUM_LOAN_AMOUNT = 0.5;
const MAXIMUM_LOAN_AMOUNT = 5.0;

export function useLoanState(): LoanState {
  const chainId = useChainId() as ChainId;
  const { address } = useAccount();
  const { wagmiConfig } = useWeb3Config();
  const publicClient = getPublicClient(wagmiConfig);

  // Get state from stores
  const loanToken = useLoanTokenStore((s) => s.loanToken);
  const collateralToken = useLoanTokenStore((s) => s.collateralToken);
  const loanAmount = useLoanTokenStore((s) => s.loanAmount);
  const collateralAmount = useLoanTokenStore((s) => s.collateralAmount);
  const {
    setLoanToken: storeSetLoanToken,
    setCollateralToken: storeSetCollateralToken,
    setLoanAmount,
    setCollateralAmount,
  } = useLoanTokenStore();

  const loanTerms = useLoanTerms();
  const loanDuration = useLoanTermsStore((s) => s.loanDuration);
  const selectedLoan = useLoanTermsStore((s) => s.selectedLoan);
  const { setLoanDuration, setLoan, setLoanTerms } = useLoanTermsStore();

  const quotes = useLoanQuotesStore((s) => s.quotes);
  const selectedQuote = useLoanQuotesStore((s) => s.selectedQuote);
  const errors = useLoanQuotesStore((s) => s.errors);
  const loadingQuotes = useLoanQuotesStore((s) => s.loadingQuotes);
  const {
    setQuotes,
    setSelectedQuote,
    setErrors,
    setLoadingQuotes,
    clearErrors,
  } = useLoanQuotesStore();

  // Initialize loan token with native currency
  const effectiveLoanToken = loanToken ?? Native.onChain(chainId);

  // Sync loan terms to store
  useEffect(() => {
    setLoanTerms(loanTerms);
  }, [loanTerms, setLoanTerms]);

  // Initialize loan token on first render
  useEffect(() => {
    if (!loanToken) {
      storeSetLoanToken(Native.onChain(chainId));
    }
  }, [chainId, loanToken, storeSetLoanToken]);

  const { countOfActiveLoans } = useCountOfActiveLoans(chainId);

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
      effectiveLoanToken,
      parseUnits(loanAmount, effectiveLoanToken.decimals),
    ),
    spender: X7ContractsEnum.X7_LendingPool(chainId),
    enabled: !!effectiveLoanToken && parseFloat(loanAmount) > 0,
  });

  const neededApprovals: TokenApprovals[] = useMemo(() => {
    return [
      {
        token: effectiveLoanToken,
        amount: parseUnits(loanAmount, effectiveLoanToken.decimals ?? 18),
        address: X7ContractsEnum.X7_LendingPool(chainId),
        approval: loanTokenApprovalState,
      },
      {
        token: collateralToken,
        amount: parseUnits(collateralAmount, collateralToken?.decimals ?? 18),
        address: X7ContractsEnum.X7_LendingPool(chainId),
        approval: collateralTokenApprovalState,
      },
    ].filter((t) => t.approval !== ApprovalState.APPROVED);
  }, [
    effectiveLoanToken,
    loanAmount,
    chainId,
    loanTokenApprovalState,
    collateralToken,
    collateralAmount,
    collateralTokenApprovalState,
  ]);

  const sanityCheck = useCallback(() => {
    clearErrors();
    const sanityErrors: { message: string; success: boolean }[] = [];

    if (
      parseFloat(loanAmount) < MINIMUM_LOAN_AMOUNT &&
      parseFloat(loanAmount) > MAXIMUM_LOAN_AMOUNT
    ) {
      sanityErrors.push({
        message: "Loaned amount must be between 0.5ETH and 5.0ETH",
        success: false,
      });
    }

    if (!collateralToken) {
      sanityErrors.push({
        message: "Please select a collateral token",
        success: false,
      });
    }

    if (parseFloat(collateralAmount) <= 0) {
      sanityErrors.push({
        message: "Please enter a collateral amount",
        success: false,
      });
    }

    if (!effectiveLoanToken) {
      sanityErrors.push({
        message: "Please select a loan token",
        success: false,
      });
    }

    if (parseFloat(loanAmount) <= 0) {
      sanityErrors.push({
        message: "Please enter a loan amount",
        success: false,
      });
    }

    setErrors(sanityErrors);
    return sanityErrors.length === 0;
  }, [
    clearErrors,
    loanAmount,
    collateralToken,
    collateralAmount,
    effectiveLoanToken,
    setErrors,
  ]);

  const SECONDS_IN_A_DAY = 86400;

  const fetchQuotes = useCallback(() => {
    if (!sanityCheck()) return;

    setLoadingQuotes(true);
    clearErrors();

    Promise.allSettled(
      Array.from({ length: countOfActiveLoans }, async (_, index) => {
        if (publicClient === undefined) {
          return;
        }

        const activeLoanTerms = await publicClient.readContract({
          abi: X7LendingPoolV2,
          address: X7ContractsEnum.X7_LendingPool(chainId),
          functionName: "activeLoanTerms",
          args: [BigInt(index)],
        });

        const _lt = loanTerms[`${activeLoanTerms}`];

        if (_lt && address) {
          return publicClient
            .readContract({
              abi: X7LendingPoolV2,
              address: X7ContractsEnum.X7_LendingPool(chainId),
              functionName: "getDiscountedQuote",
              args: [
                address,
                activeLoanTerms,
                parseUnits(loanAmount, effectiveLoanToken.decimals),
                BigInt(loanDuration * SECONDS_IN_A_DAY),
              ],
            })
            .then((response) => ({
              loanTerm: _lt,
              result: response,
              success: true,
            }))
            .catch((err) => ({
              loanTerm: _lt,
              error: err,
              success: false,
            }));
        } else {
          return Promise.resolve({
            loanTerm: null,
            result: null,
            success: false,
          });
        }
      }),
    )
      .then((responses) => {
        setLoadingQuotes(false);
        setQuotes(responses as unknown as RawQuoteResponse[]);
      })
      .catch((error) => {
        setLoadingQuotes(false);
        log.error(LogCodes.FAIL, `${error}`);
      });
  }, [
    sanityCheck,
    setLoadingQuotes,
    clearErrors,
    countOfActiveLoans,
    publicClient,
    chainId,
    loanTerms,
    address,
    loanAmount,
    effectiveLoanToken.decimals,
    loanDuration,
    setQuotes,
  ]);

  const setCollateralToken = useCallback(
    (value: Currency) => {
      storeSetCollateralToken(value);
      setCollateralAmount("0");
      setQuotes([]);
    },
    [storeSetCollateralToken, setCollateralAmount, setQuotes],
  );

  const setLoanToken = useCallback(
    (value: Currency) => {
      storeSetLoanToken(value);
    },
    [storeSetLoanToken],
  );

  // Auto-fetch quotes when relevant state changes
  useEffect(() => {
    fetchQuotes();
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [loanAmount, effectiveLoanToken, collateralAmount, collateralToken, loanDuration]);

  // Update selected quote when quotes or selected loan changes
  useEffect(() => {
    if (!!selectedLoan?.address && quotes.length > 0) {
      const matchingQuote = quotes.find((quote: RawQuoteResponse) => {
        return (
          quote.status === "fulfilled" &&
          quote.value?.loanTerm?.address === selectedLoan.address
        );
      });

      if (matchingQuote) {
        setSelectedQuote(matchingQuote.value);
      } else {
        log.warn(LogCodes.LOAN_INFO, "No matching quote found for selected loan", {
          selectedLoanAddress: selectedLoan.address,
        });
      }
    }
  }, [quotes, selectedLoan, loadingQuotes, setSelectedQuote]);

  const builtState: LoanState = useMemo(
    () => ({
      state: {
        errors,
        quotes,
        loanDuration,
        loanTerms,
        selectedQuote,
        selectedLoan,
        loanToken: effectiveLoanToken,
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
      effectiveLoanToken,
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

  return builtState;
}
