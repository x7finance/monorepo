"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@x7/ui/tabs";

import { XChangeBoard } from "..";
import { XChangeSwap } from "../../_components/swap/base";

export function TradingLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for token parameters to determine default tab
  const hasTokenParams =
    searchParams.has("token0") || searchParams.has("token1");
  const activeTab =
    searchParams.get("tab") ?? (hasTokenParams ? "swap" : "tokens");

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Mobile Tabs */}
      <div className="mb-6 lg:hidden">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="tokens">
              <XChangeBoard />
            </TabsContent>
            <TabsContent value="swap" className="flex justify-center">
              <XChangeSwap compactView={true} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Desktop Grid */}
      <div className="hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-4">
        <div className="col-span-1 lg:col-span-3">
          <XChangeBoard />
        </div>

        <div className="col-span-1">
          <div className="">
            <XChangeSwap compactView={true} />
          </div>
        </div>
      </div>
    </>
  );
}
