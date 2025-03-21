/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { IChartApi, Time } from "lightweight-charts";
import {
  CandlestickSeries,
  createChart,
  createTextWatermark,
  CrosshairMode,
} from "lightweight-charts";

import { LoadingPioneer } from "~/lib/components/core/loading-pioneer";

// TODO: add different chart types (bars, line, area, etc)

interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PriceChartProps {
  data: ChartDataPoint[];
  liquidityEvents: any;
  tokenInfo: any;
}

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  liquidityEvents,
  tokenInfo,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [showUniswapInfo, setShowUniswapInfo] = useState<boolean | null>(null);

  useEffect(() => {
    if (liquidityEvents) {
      setShowUniswapInfo(liquidityEvents.liquidityEvents.length > 0);
    }
  }, [liquidityEvents]);

  useEffect(() => {
    if (
      chartContainerRef.current &&
      data.length >= 2 &&
      showUniswapInfo === false
    ) {
      const newChart: IChartApi = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: "#1f2937" },
          textColor: "#d1d5db",
        },
        grid: {
          vertLines: { color: "rgba(255, 255, 255, 0.1)" },
          horzLines: { color: "rgba(255, 255, 255, 0.1)" },
        },
        rightPriceScale: {
          borderColor: "rgba(255, 255, 255, 0.2)",
          visible: true,
          borderVisible: true,
          alignLabels: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
          autoScale: false,
        },
        timeScale: {
          borderColor: "rgba(255, 255, 255, 0.2)",
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      });

      // Add watermark as a primitive
      const panes = newChart.panes();
      if (panes.length > 0) {
        const firstPane = panes[0]!;
        createTextWatermark(firstPane, {
          horzAlign: "center",
          vertAlign: "center",
          lines: [
            {
              text: "Bondle.xyz",
              color: "rgba(255, 255, 255, 0.1)",
              fontSize: 28,
            },
          ],
        });
      }

      const candleSeries = newChart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      //const enhancedChartData = enhanceSmallCandles(data);

      // Sort and deduplicate data
      const sortedData = [...data].sort((a, b) => {
        if (a.time === b.time) {
          // For same timestamps, maintain original order
          return data.indexOf(a) - data.indexOf(b);
        }
        return a.time - b.time;
      });

      // Remove duplicates by slightly incrementing timestamps
      const processedData = sortedData.reduce(
        (acc: ChartDataPoint[], curr, idx) => {
          if (
            idx > 0 &&
            acc.length > 0 &&
            acc[acc.length - 1]?.time !== undefined &&
            curr.time === acc[acc.length - 1]?.time
          ) {
            // Add 1 second to duplicate timestamps
            curr = { ...curr, time: curr.time + 1 };
          }
          acc.push(curr);
          return acc;
        },
        [],
      );

      const enhancedChartData = enhanceSmallCandles(processedData);
      // TODO: add different chart types (bars, line, area, etc)

      candleSeries.setData(
        enhancedChartData.map((item) => ({
          time: item.time as Time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        })),
      );

      candleSeries.applyOptions({
        priceFormat: {
          type: "custom",
          formatter: formatPrice,
          minMove: 1e-9,
        },
      });

      const prices = enhancedChartData.flatMap((item) => [
        item.open,
        item.high,
        item.low,
        item.close,
      ]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      const zoomFactor = 0.8;
      const priceRange = maxPrice - minPrice;
      const _zoomedMinPrice = Math.max(
        0,
        minPrice - (priceRange * (1 - zoomFactor)) / 2,
      );
      const _zoomedMaxPrice = maxPrice + (priceRange * (1 - zoomFactor)) / 2;

      newChart.priceScale("right").applyOptions({
        autoScale: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      });
      if (enhancedChartData.length > 0) {
        newChart.timeScale().setVisibleRange({
          from: enhancedChartData[0]?.time as Time,
          to: enhancedChartData[enhancedChartData.length - 1]?.time as Time,
        });
      }

      setChart(newChart);

      return () => {
        newChart.remove();
      };
    }
  }, [data, showUniswapInfo]);

  useEffect(() => {
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chart]);

  if (showUniswapInfo === null) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-800">
        <LoadingPioneer />
      </div>
    );
  }

  if (showUniswapInfo && liquidityEvents.liquidityEvents.length > 0) {
    const event = liquidityEvents.liquidityEvents[0];
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-800 p-6">
        <Image
          src={tokenInfo.logo}
          alt={tokenInfo.name}
          width={64}
          height={64}
          className="mb-4 rounded-full"
        />
        <h2 className="mb-2 text-lg font-bold text-white">
          {tokenInfo.name} Listed on Chewyswap
        </h2>
        <br />
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">Token</p>
            <p className="text-lg font-semibold text-white">
              {/* {formatAmountV3(event.tokenAmount)} {tokenInfo.symbol} */}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">BONE</p>
            <p className="text-lg font-semibold text-white">
              {/* {formatAmountV3(event.ethAmount)} BONE */}
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <a
            href={`https://www.shibariumscan.io/tx/${event.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            View TXID
          </a>
          <a
            href={`/swap?token0=${tokenInfo.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-red-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            Buy on Xchange
          </a>
        </div>
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-800">
        <p className="text-lg text-white">Not enough data to display chart</p>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      className="h-[500px] w-full overflow-hidden rounded-lg bg-gray-800"
    />
  );
};

function enhanceSmallCandles(data: ChartDataPoint[]): ChartDataPoint[] {
  const minCandleSize = 1e-9;
  return data.map((item) => {
    const bodySize = Math.abs(item.open - item.close);
    if (bodySize < minCandleSize) {
      const midPoint = (item.open + item.close) / 2;
      const adjustment = minCandleSize / 2;
      return {
        ...item,
        open: midPoint - adjustment,
        close: midPoint + adjustment,
        high: Math.max(item.high, midPoint + adjustment),
        low: Math.min(item.low, midPoint - adjustment),
      };
    }
    return item;
  });
}

function formatPrice(price: number) {
  return price.toFixed(9);
}

export default PriceChart;
