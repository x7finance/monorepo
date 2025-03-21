import type { Pair, Pool } from "@x7/sdk";
import type { SwapRoute } from "@x7/smart-order-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@x7/ui/accordion";
import { Protocol } from "@x7/utils";

interface SwapChartLiquidityAccordionProps {
  route?: SwapRoute;
}

export function SwapChartLiquidityAccordion({
  route,
}: SwapChartLiquidityAccordionProps) {
  const protocol = route?.trade.swaps[0]?.route.protocol;
  const pools = route?.trade.swaps[0]?.route.pools ?? [];
  const pair = route?.trade.swaps[0]?.route.pools[0] as Pair;
  const pool = route?.trade.swaps[0]?.route.pools[0] as Pool;

  const dex = protocol === Protocol.V2 ? pair.pairType : pool.poolType;

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-heading">
              DEX Details
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-left">DEX: {dex}</p>
              <p className="text-left">Protocol: {protocol}</p>
              <p className="break-all text-left text-xs">
                {protocol === Protocol.V2 ? "Pair Address:" : "Pool Address:"}
              </p>
              <div className="break-all text-left text-xs">
                {pools.map((pair, index) => {
                  const pairData = pair as Pair;
                  const poolData = pair as Pool;

                  return (
                    <div key={index}>
                      <p className="break-all text-left text-xs">
                        Hop{index + 1}:
                      </p>
                      <p className="break-all text-left text-xs">
                        {protocol === Protocol.V2
                          ? pairData.liquidityToken.address
                          : poolData.address}
                      </p>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-heading">
              {route?.trade.swaps[0]?.route.input.symbol} Details
            </AccordionTrigger>
            <AccordionContent>
              <p>Name: {route?.trade.swaps[0]?.route.input.name}</p>
              <p>Symbol: {route?.trade.swaps[0]?.route.input.symbol}</p>
              <p>Decimals: {route?.trade.swaps[0]?.route.input.decimals}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-heading">
              {route?.trade.swaps[0]?.route.output.symbol} Details
            </AccordionTrigger>
            <AccordionContent>
              <p>Name: {route?.trade.swaps[0]?.route.output.name}</p>
              <p>Symbol: {route?.trade.swaps[0]?.route.output.symbol}</p>
              <p>Decimals: {route?.trade.swaps[0]?.route.output.decimals}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
