/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { isAddress } from "viem";
import type { Address } from "viem";
import { useAccount } from "wagmi";

import { cn } from "@x7/css";
import { FACTORY_ADDRESSES, generateChainEtherTokenEnum } from "@x7/sdk";
import { Alert, AlertDescription } from "@x7/ui/alert";
import { Button } from "@x7/ui/button";
import { Input } from "@x7/ui/input";
import { Label } from "@x7/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@x7/ui/select";
import {
  ChainId,
  DEAD_ADDRESS,
  Implementation,
  Native,
  Protocol,
} from "@x7/utils";

import { useGetPair } from "~/lib/hooks/pairs/useGetPair";
import {
  useFee,
  useRegisteredTokens,
} from "~/lib/hooks/tokens/useXchangeTokenList";
import { useXchangeTokenListAddToken } from "~/lib/hooks/tokens/useXchangeTokenListAddToken";

export function DefaultTokenAdditionForm() {
  const { chainId, isConnected } = useAccount();
  const nativeCurrency = Native.onChain((chainId as ChainId) ?? 1);

  const [selectedDex, setSelectedDex] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<`0x${string}` | undefined>();

  const { fee } = useFee(chainId as ChainId);
  const factoryAddress = FACTORY_ADDRESSES[chainId ?? ChainId.ETHEREUM]?.[
    selectedDex?.toString() ?? Implementation.XCHANGE
  ]?.[Protocol.V2] as Address;

  const { registeredToken } = useRegisteredTokens(
    chainId as ChainId,
    inputValue!,
  );
  const { getPair } = useGetPair(
    chainId as ChainId,
    factoryAddress,
    inputValue!,
    generateChainEtherTokenEnum(chainId as ChainId) ?? DEAD_ADDRESS,
  );

  const { writeContract, data, isPending } = useXchangeTokenListAddToken({
    fee: fee.toString(),
    tokenAddress: inputValue!,
    factoryAddress: factoryAddress,
  });

  const handleAddToken = useCallback(() => {
    if (isAddress(inputValue!)) {
      // @ts-expect-error: todo fixs
      writeContract(data?.request);
    }
  }, [inputValue, writeContract, data]);

  const alertText = registeredToken
    ? "Token is already registered on the Xchange default token list"
    : !isAddress(factoryAddress)
      ? "This DEX is not supported on this chain. Please select another DEX."
      : !isAddress(getPair) || getPair === DEAD_ADDRESS || getPair === undefined
        ? "This token does not have a pair on the selected DEX. Please create a pair or select another DEX."
        : "There was an error. Please try again.";

  const isValid = useMemo(
    () =>
      isAddress(inputValue!) &&
      selectedDex !== null &&
      !registeredToken &&
      isAddress(factoryAddress) &&
      getPair !== DEAD_ADDRESS &&
      isAddress(getPair),
    [inputValue, selectedDex, registeredToken, factoryAddress, getPair],
  );

  const showErrorMessage = inputValue && inputValue?.length > 1 && !isValid;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs text-zinc-800 dark:text-zinc-200">
          Add a token to the Xchange default token list
        </p>
        <p className="text-xs text-muted-foreground">
          Current fee is {fee.toString()}{" "}
          {nativeCurrency.symbol.toString() ?? "ETH"}
        </p>
      </div>

      <div className="grid w-full max-w-xl gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address">Token Address</Label>
          <div className="relative">
            <Input
              id="address"
              placeholder="Enter token address"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value as `0x${string}`)}
            />
            {inputValue && (
              <Button
                type="button"
                onClick={() => setInputValue(undefined)}
                variant="outline"
                className="ml-2"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dex">Select DEX</Label>
          <Select
            value={selectedDex ?? "XCHANGE"}
            onValueChange={setSelectedDex}
          >
            <SelectTrigger className="flex h-10 rounded-lg border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2">
              <SelectValue placeholder="Select a DEX" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Implementation).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showErrorMessage && (
          <Alert variant="destructive" className={cn("bg-zinc-100")}>
            <AlertDescription>{alertText}</AlertDescription>
          </Alert>
        )}
        <Button
          loading={isPending}
          disabled={!isValid || !isConnected}
          onClick={handleAddToken}
          className="w-full"
        >
          Add Token
        </Button>
      </div>
    </div>
  );
}
