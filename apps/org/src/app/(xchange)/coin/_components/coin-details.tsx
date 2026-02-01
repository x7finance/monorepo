/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import type { ChainId } from "@x7/utils"

import { notFound, useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useChainId } from "wagmi"

import { Button } from "@x7/ui/button"
import { Card } from "@x7/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@x7/ui/tabs"
import { Token } from "@x7/utils"
import { useTokenData } from "~/lib/hooks/tokens/useTokenData"
import { CheckerProviderComponent } from "~/lib/providers/checker"

import { X7SwapForm } from "../../_components/swap/swap-form"

import { PriceChartEmbed } from "./chart-view-embedded"
import {
  ChatSkeleton,
  TokenInfoSkeleton,
  TradingViewSkeleton,
} from "./skeletons"
import { TokenInfo } from "./token-info"

const QUICK_BUY_AMOUNTS = [0.005, 0.01, 0.05, 0.1, 0.25]

export function CoinDetails() {
  const params = useParams()
  const chainId = useChainId()
  const contractAddress = params.contract as `0x${string}`
  const [_isClient, setIsClient] = useState(false)
  const { data: token } = useTokenData(contractAddress)
  const [activeTab, setActiveTab] = useState<"chart" | "trade">("chart")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!contractAddress) {
    notFound()
  }

  const handleQuickBuy = (amount: number) => {
    setSelectedAmount(amount)
    setActiveTab("trade")
  }

  const QuickBuyButtons = () => (
    <div className="flex flex-wrap gap-2 p-2">
      <p className="block text-xs text-zinc-500">Quick Buy</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_BUY_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => handleQuickBuy(amount)}
            className="flex-1"
          >
            {amount} ETH
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <CheckerProviderComponent>
      <div className="container mx-auto space-y-8 px-2 py-2 sm:px-4 sm:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <Suspense fallback={<TokenInfoSkeleton />}>
              {token ? <TokenInfo token={token} /> : <TokenInfoSkeleton />}
            </Suspense>

            {/* Mobile Tabs */}
            <div className="mt-4 lg:hidden">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "chart" | "trade")}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="chart" className="flex-1">
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="trade" className="flex-1">
                    Trade
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <Card className="p-0">
                    <QuickBuyButtons />
                    <Suspense fallback={<TradingViewSkeleton />}>
                      <PriceChartEmbed
                        chainId={chainId}
                        contractAddress={contractAddress}
                      />
                    </Suspense>
                  </Card>
                </TabsContent>
                <TabsContent value="trade">
                  <Card className="mt-4 border-none p-0">
                    <Suspense fallback={<ChatSkeleton />}>
                      <X7SwapForm
                        token1={
                          new Token({
                            address: contractAddress,
                            chainId: chainId as ChainId,
                            decimals: token.normalizedDecimals,
                            symbol: token.symbol,
                            name: token.name,
                          })
                        }
                        actionText="Trade"
                        defaultAmount={selectedAmount}
                        onQuickBuySelect={handleQuickBuy}
                      />
                    </Suspense>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop Chart */}
            <div className="hidden lg:block">
              <Card className="mt-4 p-0">
                <Suspense fallback={<TradingViewSkeleton />}>
                  <PriceChartEmbed
                    chainId={chainId}
                    contractAddress={contractAddress}
                  />
                </Suspense>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Trade Panel */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-20">
              <Card className="border-none p-0">
                <Suspense fallback={<ChatSkeleton />}>
                  <X7SwapForm
                    token1={
                      new Token({
                        address: contractAddress,
                        chainId: chainId as ChainId,
                        decimals: token.normalizedDecimals,
                        symbol: token.symbol,
                        name: token.name,
                      })
                    }
                    actionText="Trade"
                    defaultAmount={selectedAmount}
                    onQuickBuySelect={handleQuickBuy}
                  />
                </Suspense>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </CheckerProviderComponent>
  )
}
