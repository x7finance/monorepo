/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Button } from "@x7/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@x7/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@x7/ui/tabs";
import type { ActiveChainId } from "@x7/utils";

import { CurrencyInput } from "~/lib/components/utils/currency-input";
import { ConnectionComponent } from "~/lib/components/utils/web3-connect-button";
import { X7D } from "~/lib/constants/tokens";
import { useBalanceWeb3 } from "~/lib/hooks/balances/useBalanceWeb3";
import { useNativeCurrency } from "~/lib/hooks/currency/useNativeCurrency";
import { useX7DMinting } from "../../fund/_hooks/useX7DMinting";
import { useX7DRedeem } from "../../fund/_hooks/useX7DRedeem";

export function X7DFunding() {
  const [refetchCount, setRefetchCount] = useState<number>(0);
  const [valueInput, setValueInput] = useState<string>("");
  const [redeemInput, setRedeemInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("mint-x7d");

  const { address, chain, isConnected } = useAccount();

  const chainId = chain?.id as ActiveChainId;

  const {
    writeContract,
    data,
    isPending,
    isSuccess: isSuccessfulMint,
  } = useX7DMinting({
    valueInput,
    setRefetchCount,
  });
  const {
    writeContract: writeContractRedeem,
    data: redeemData,
    isPending: redeemPending,
    isSuccess: isSuccessfulRedeem,
  } = useX7DRedeem({ redeemInput, setRefetchCount });
  const nativeCurrency = useNativeCurrency({ chainId });

  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalances,
  } = useBalanceWeb3({
    chainId,
    account: address,
    currency: X7D[chainId],
  });

  const [big, portion] = (balance ? `${balance.toFixed(2)}` : "0.00").split(
    ".",
  );

  const handleMint = useCallback(() => {
    if (valueInput && data?.request) {
      writeContract(data.request);
    }
  }, [valueInput, data, writeContract]);

  const handleRedeem = useCallback(() => {
    if (redeemInput && redeemData?.request) {
      writeContractRedeem(redeemData.request);
    }
  }, [redeemInput, redeemData, writeContractRedeem]);

  const refetchBalancesCallback = useCallback(() => {
    void refetchBalances({ cancelRefetch: true });
  }, [refetchBalances]);

  useEffect(() => {
    refetchBalancesCallback();
  }, [refetchCount, refetchBalancesCallback]);

  useEffect(() => {
    if (isSuccessfulMint || isSuccessfulRedeem) {
      refetchBalancesCallback();
      setRedeemInput("");
      setValueInput("");
    }
  }, [isSuccessfulMint, isSuccessfulRedeem, refetchBalancesCallback]);

  return (
    <Card className="mx-auto mt-6 max-w-2xl">
      <CardHeader className="space-y-1 px-3 sm:px-6">
        <CardTitle className="mb-2 text-zinc-900 dark:text-zinc-100">
          X7D Funding
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Mint or redeem X7D tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 px-3 sm:px-6">
        <div className="mb-4 flex items-center gap-x-2">
          <div className="flex h-full items-end font-bold text-black dark:text-white">
            {isBalanceLoading ? (
              <div className="h-6 w-20 animate-pulse rounded-lg bg-zinc-300 dark:bg-zinc-700" />
            ) : (
              <span className="text-3xl">
                {big}.
                <span className="text-xl font-semibold">{portion ?? "00"}</span>
              </span>
            )}
          </div>
          <div className="flex h-full items-end text-sm font-bold tracking-widest text-muted-foreground">
            {X7D[chainId]?.name ?? "X7D"} BALANCE
          </div>
        </div>

        <Tabs
          defaultValue="mint-x7d"
          className="min-w-full"
          onValueChange={(val) => setActiveTab(val)}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mint-x7d">Mint X7D</TabsTrigger>
            <TabsTrigger value="redeem-x7d">Redeem X7D</TabsTrigger>
          </TabsList>
          <TabsContent value="mint-x7d">
            <div className="flex flex-col">
              {Boolean(nativeCurrency && chainId) && (
                <CurrencyInput
                  id="collateral-token"
                  type="INPUT"
                  className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
                  chainId={chainId}
                  value={valueInput}
                  onChange={setValueInput}
                  currency={nativeCurrency}
                  loading={false}
                  currencyLoading={false}
                  forceDisable={false}
                  refetchCounter={refetchCount}
                />
              )}

              <div className="py-2">
                <Button
                  loading={isPending}
                  variant={
                    !isConnected || parseFloat(valueInput) === 0 || !valueInput
                      ? "outline"
                      : "primary"
                  }
                  size={"lg"}
                  disabled={
                    !isConnected || parseFloat(valueInput) === 0 || !valueInput
                  }
                  onClick={handleMint}
                  className="w-full"
                >
                  {!isConnected
                    ? "Connect Wallet"
                    : parseFloat(valueInput) === 0 || !valueInput
                      ? "Enter Value"
                      : "Mint X7D"}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="redeem-x7d">
            <div className="flex flex-col">
              <CurrencyInput
                id="collateral-token"
                type="INPUT"
                className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
                chainId={chainId}
                value={redeemInput}
                onChange={setRedeemInput}
                currency={X7D[chainId]}
                loading={false}
                currencyLoading={false}
                forceDisable={false}
                refetchCounter={refetchCount}
              />

              <div className="py-2">
                <Button
                  loading={redeemPending}
                  variant={
                    !isConnected ||
                    parseFloat(redeemInput) === 0 ||
                    !redeemInput
                      ? "outline"
                      : "primary"
                  }
                  size={"lg"}
                  disabled={
                    !isConnected ||
                    parseFloat(redeemInput) === 0 ||
                    !redeemInput
                  }
                  onClick={handleRedeem}
                  className="w-full"
                >
                  {!isConnected
                    ? "Connect Wallet"
                    : parseFloat(redeemInput) === 0 || !redeemInput
                      ? "Enter Value"
                      : "Redeem X7D"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isConnected && !address && <ConnectionComponent />}
      </CardFooter>
    </Card>
  );
}
