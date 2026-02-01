/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import type { FC } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { isAddress } from "viem";

import { cn } from "@x7/css";
import { SearchIcon, XIcon } from "@x7/icons";
import { List } from "@x7/ui";
import { Button, buttonVariants } from "@x7/ui/button";
import { CurrencyIcon } from "@x7/ui/currency/currency-icon";
import { SkeletonCircle, SkeletonText } from "@x7/ui/skeleton";
import { TextField } from "@x7/ui/text-field";
import { TokenSelectorImportRow } from "@x7/ui/token-selector/token-selector-import-row";
import { TokenSelectorCurrencyList } from "@x7/ui/token-selector/tokens-selector-currency-list";
import type { ChainId, Currency as CurrencyType, Token } from "@x7/utils";
import { Native } from "@x7/utils";

import { usePrices } from "~/lib/hooks/prices/usePrices";
import { useCustomTokens } from "~/lib/hooks/tokens/useCustomTokens";
import { usePinnedTokens } from "~/lib/hooks/tokens/usePinnedTokens";
import { useSortedTokenList } from "~/lib/hooks/tokens/useSortedTokenList";
import { useTokens } from "~/lib/hooks/tokens/useTokens";
import { useTokenWithCache } from "~/lib/hooks/tokens/useTokenWithCache";

interface TokenViewProps {
  id: string;
  open: boolean;
  selected: CurrencyType | undefined;
  chainId: ChainId;
  onSelect(currency: CurrencyType): void;
  currencies?: Record<string, Token>;
  includeNative?: boolean;
  hidePinnedTokens?: boolean;
  hideSearch?: boolean;
  setOpen?(open: boolean): void;
}

export const TokenListContent: FC<TokenViewProps> = ({
  includeNative = true,
  id,
  selected,
  onSelect,
  chainId,
  currencies,
  hidePinnedTokens,
  hideSearch,
  setOpen,
}) => {
  const [query, setQuery] = useState("");

  const { data: customTokenMap, mutate: customTokenMutate } = useCustomTokens();
  const {
    data: pinnedTokenMap,
    mutate: pinnedTokenMutate,
    hasToken: isTokenPinned,
  } = usePinnedTokens();

  const { data: defaultTokenMap, isLoading: isTokensLoading } = useTokens({
    chainId,
  });

  // TODO: implement on chain usePrices
  const { data: pricesMap } = usePrices({ _chainId: chainId });

  const tokenMap = useMemo(() => {
    return {
      ...defaultTokenMap,
    };
  }, [defaultTokenMap]);

  const officialTokenIds = useMemo(() => {
    if (!defaultTokenMap) return [];
    return Object.values(defaultTokenMap).map((el) => el.wrapped.address);
  }, [defaultTokenMap]);

  const { data: queryToken, isLoading: isQueryTokenLoading } =
    useTokenWithCache({
      chainId,
      address: query,
      withStatus: false,
      enabled: isAddress(query),
      keepPreviousData: false,
    });

  const { data: sortedTokenList } = useSortedTokenList({
    query,
    customTokenMap: currencies ? {} : customTokenMap,
    tokenMap: currencies || tokenMap,
    pricesMap,
    balancesMap: {},
    chainId,
    includeNative,
  });

  // Override the token sorting in this component if we're not searching
  // This will ensure X7 tokens appear at the top
  const displayTokenList = useMemo(() => {
    if (query || !sortedTokenList) return sortedTokenList;

    // Create a custom sorter that prioritizes X7 tokens
    return [...sortedTokenList].sort((a, b) => {
      const aIsX7 = (a.symbol || "").includes("X7");
      const bIsX7 = (b.symbol || "").includes("X7");

      if (aIsX7 && !bIsX7) return -1;
      if (!aIsX7 && bIsX7) return 1;
      return 0;
    });
  }, [sortedTokenList, query]);

  const pinnedTokens = useMemo(() => {
    return (pinnedTokenMap[chainId] ?? [])
      .map((id: string) => {
        const [, address]: string[] = id.split(":");
        if (address === "NATIVE") {
          return Native.onChain(chainId);
        }

        if (address) {
          return tokenMap[address] ?? customTokenMap[id];
        }
      })
      .filter((token): token is Token => !!token);
  }, [pinnedTokenMap, tokenMap, chainId, customTokenMap]);

  const _onSelect = useCallback(
    (currency: CurrencyType) => {
      if (onSelect) {
        onSelect(currency);
      }

      if (setOpen) {
        setOpen(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSelect],
  );
  const _onPin = useCallback(
    (currencyId: string) => {
      if (isTokenPinned(currencyId)) {
        pinnedTokenMutate("remove", currencyId);
      } else {
        pinnedTokenMutate("add", currencyId);
      }
    },
    [pinnedTokenMutate, isTokenPinned],
  );

  const handleImport = useCallback(
    (currency: Token) => {
      customTokenMutate("add", [currency]);
      _onSelect(currency);
    },
    [_onSelect, customTokenMutate],
  );

  const isLoading = isTokensLoading || isQueryTokenLoading;

  const memoizedPin = useMemo(
    () => ({
      onPin: _onPin,
      isPinned: isTokenPinned,
    }),
    [_onPin, isTokenPinned],
  );

  const memoizedBalancesMap = useMemo(() => ({}), []);
  const memoizedPricesMap = useMemo(() => pricesMap, [pricesMap]);

  // Loading skeleton component
  const LoadingSkeletons = () => (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="flex h-[64px] w-full items-center rounded-lg px-3"
        >
          <div className="flex grow items-center justify-between gap-2 rounded-sm">
            <div className="flex grow flex-row items-center gap-4">
              <SkeletonCircle radius={40} />
              <div className="flex flex-col items-start">
                <SkeletonText className="w-[100px]" />
                <SkeletonText fontSize="sm" className="w-[60px]" />
              </div>
            </div>

            <div className="flex w-full flex-col">
              <SkeletonText className="w-[80px]" />
              <SkeletonText fontSize="sm" align="right" className="w-[40px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {!hideSearch ? (
        <div className="flex w-full gap-2">
          <TextField
            placeholder="Search by token or address"
            icon={SearchIcon}
            iconProps={{
              className: "text-zinc-500",
            }}
            className="w-full"
            variant="default"
            type="text"
            testdata-id={`${id}-address-input`}
            value={query}
            onValueChange={setQuery}
          />
        </div>
      ) : null}

      {pinnedTokens.length > 0 && !hidePinnedTokens ? (
        <div className="flex flex-wrap gap-2">
          {pinnedTokens.map((token: Token) => {
            return (
              <div key={token.id} className="group flex justify-center">
                <div
                  className={cn(
                    buttonVariants({ size: "sm", variant: "secondary" }),
                    "group flex cursor-pointer items-center",
                  )}
                  key={token.id}
                  onClick={() => _onSelect(token)}
                >
                  <span className="mr-2">
                    <CurrencyIcon
                      width={20}
                      height={20}
                      currency={token}
                      disableLink
                    />
                  </span>
                  {token.symbol}
                  <Button
                    size="sm"
                    name="remove"
                    variant="ghost"
                    className="relative left-1.5 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      _onPin(token.id);
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <List.Control className="relative flex min-h-[256px]! flex-1 grow flex-col gap-3 rounded-none border-0 px-1 py-0.5">
        {isLoading ? (
          <LoadingSkeletons />
        ) : (
          <div className={cn("block flex-1")}>
            {queryToken &&
              !customTokenMap[
                `${queryToken.chainId}:${queryToken.wrapped.address}`
              ] &&
              !tokenMap[`${queryToken.wrapped.address}`] && (
                <TokenSelectorImportRow
                  currencies={[queryToken]}
                  onImport={() => queryToken && handleImport(queryToken)}
                />
              )}

            <TokenSelectorCurrencyList
              selected={selected}
              onSelect={_onSelect}
              id={id}
              // @ts-expect-error: todo fix
              pin={memoizedPin}
              officialTokenIds={officialTokenIds}
              currencies={displayTokenList}
              chainId={chainId}
              balancesMap={memoizedBalancesMap}
              pricesMap={memoizedPricesMap}
              isBalanceLoading={false}
            />

            {sortedTokenList?.length === 0 && !queryToken && chainId && (
              <span className="flex h-10 items-center justify-center text-center text-sm text-zinc-500">
                No results found.
              </span>
            )}
          </div>
        )}
      </List.Control>
    </>
  );
};
