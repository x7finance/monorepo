"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { cn } from "@x7/css";
import { Button, buttonVariants } from "@x7/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@x7/ui/radix-collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@x7/ui/tabs";
import type { ActiveChainId } from "@x7/utils";

import { CurrencyInput } from "~/lib/components/utils/currency-input";
import { ConnectionComponent } from "~/lib/components/utils/web3-connect-button";
import { X7DAO } from "~/lib/constants/tokens";
import { useBalanceWeb3 } from "~/lib/hooks/balances/useBalanceWeb3";

export function X7Staking() {
  const [refetchCount, _setRefetchCount] = useState<number>(0);
  const [valueInput, setValueInput] = useState<string>("");
  const [redeemInput, setRedeemInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("mint-x7d");
  const [open, setOpen] = useState(false);
  const { address, chain, isConnected } = useAccount();

  const chainId = chain?.id as ActiveChainId;

  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchDAO,
  } = useBalanceWeb3({
    chainId,
    account: address,
    currency: X7DAO,
  });

  const {
    data: _stakedBalance,
    isLoading: _isStakedBalanceLoading,
    refetch: refetchStaked,
  } = useBalanceWeb3({
    chainId,
    account: address,
    currency: X7DAO,
  });

  const [big, portion] = (balance ? `${balance.toFixed(2)}` : "0.00").split(
    ".",
  );

  useEffect(() => {
    void refetchDAO({ cancelRefetch: true });
    void refetchStaked({ cancelRefetch: true });
  }, [refetchCount, refetchStaked, refetchDAO]);

  //   useEffect(() => {
  //     void refetchDAO({ cancelRefetch: true });
  //     void refetchStaked({ cancelRefetch: true });
  //     setRedeemInput("");
  //     setValueInput("");
  //   }, [refetchStaked, refetchDAO]);

  return (
    <div className="">
      <Collapsible
        className="flex h-full w-full flex-col"
        open={open}
        onOpenChange={setOpen}
        disabled={!isConnected}
      >
        <CollapsibleTrigger
          asChild={true}
          className="w-full border-b border-zinc-400 dark:border-zinc-800"
        >
          <div className="flex w-full pb-4">
            <div className="flex items-center gap-x-2">
              <div className="flex h-full items-end font-bold text-black dark:text-white">
                {isBalanceLoading ? (
                  <div className="h-6 w-20 animate-pulse rounded-lg bg-zinc-300 dark:bg-zinc-700" />
                ) : (
                  <span className="text-3xl">
                    {big}.
                    <span className="text-xl font-semibold">
                      {portion ?? "00"}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex h-full items-end text-sm font-bold tracking-widest text-muted-foreground">
                X7sDAO BALANCE
              </div>
            </div>
            <div className="ml-auto flex items-end gap-x-2">
              <span
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "h-8 p-1 text-sm sm:h-10 sm:px-4 sm:py-2",
                  "text-xs transition-opacity duration-500 ease-in-out sm:text-sm",
                  {
                    "opacity-0": !open,
                  },
                )}
              >
                Close
              </span>
              {parseFloat(`${balance?.toFixed(2)}`) > 0 && (
                <span
                  role="button"
                  onClick={() => {
                    setActiveTab("redeem-x7d");
                    setOpen(!open);
                  }}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "h-8 p-1 text-sm sm:h-10 sm:px-4 sm:py-2",
                    "text-xs transition-opacity duration-500 ease-in-out sm:text-sm",
                    {
                      "hidden opacity-0": open,
                    },
                  )}
                >
                  Withdraw X7DAO
                </span>
              )}

              {!isConnected && !address ? (
                <ConnectionComponent />
              ) : (
                <span
                  role="button"
                  onClick={() => {
                    setActiveTab("mint-x7d");
                    setOpen(!open);
                  }}
                  className={cn(
                    buttonVariants({
                      variant: "primary",
                    }),
                    "h-8 p-1 text-sm sm:h-10 sm:px-4 sm:py-2",
                    "text-xs transition-opacity duration-500 ease-in-out sm:text-sm",
                    {
                      "hidden opacity-0": open,
                    },
                  )}
                >
                  Stake X7DAO
                </span>
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            `flex w-full transform overflow-hidden rounded-b-xl border border-t-0 border-zinc-800 bg-zinc-900/50 transition-all duration-500 ease-in-out ${open ? "max-h-screen" : "max-h-0"}`,
          )}
        >
          <div className="relative mx-auto sm:px-6 lg:px-8">
            <div className="flex-1 px-2 py-6 sm:px-0 sm:py-16">
              <div className="mx-auto max-w-md">
                <Tabs
                  defaultValue="mint-x7d"
                  className="min-w-full"
                  onValueChange={(val) => setActiveTab(val)}
                  value={activeTab}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mint-x7d">Stake X7DAO</TabsTrigger>
                    <TabsTrigger value="redeem-x7d">Unstake X7DAO</TabsTrigger>
                  </TabsList>
                  <TabsContent value="mint-x7d">
                    <div className="flex flex-col">
                      <CurrencyInput
                        id="collateral-token"
                        type="INPUT"
                        className="w-full rounded-lg bg-white p-3 py-2 dark:bg-zinc-800"
                        chainId={chainId}
                        value={valueInput}
                        onChange={setValueInput}
                        currency={X7DAO}
                        loading={false}
                        currencyLoading={false}
                        forceDisable={false}
                        refetchCounter={refetchCount}
                      />

                      <div className="py-6">
                        <Button
                          loading={false}
                          variant={"primary"}
                          disabled={
                            !isConnected || parseFloat(valueInput) === 0
                          }
                          onClick={console.log}
                          className="w-full"
                        >
                          Stake
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
                        currency={X7DAO}
                        loading={false}
                        currencyLoading={false}
                        forceDisable={false}
                        refetchCounter={refetchCount}
                      />

                      <div className="py-6">
                        <Button
                          loading={false}
                          variant={"primary"}
                          disabled={
                            !isConnected || parseFloat(redeemInput) === 0
                          }
                          onClick={console.log}
                          className="w-full"
                        >
                          Unstake
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
