/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
// metricLogger.ts

import type { Logger } from "@x7/utils";
import { LogCodes } from "@x7/utils";

import { log } from "./log";

export enum MetricLoggerUnit {
  Seconds = "Seconds",
  Microseconds = "Microseconds",
  Milliseconds = "Milliseconds",
  Bytes = "Bytes",
  Kilobytes = "Kilobytes",
  Megabytes = "Megabytes",
  Gigabytes = "Gigabytes",
  Terabytes = "Terabytes",
  Bits = "Bits",
  Kilobits = "Kilobits",
  Megabits = "Megabits",
  Gigabits = "Gigabits",
  Terabits = "Terabits",
  Percent = "Percent",
  Count = "Count",
  BytesPerSecond = "Bytes/Second",
  KilobytesPerSecond = "Kilobytes/Second",
  MegabytesPerSecond = "Megabytes/Second",
  GigabytesPerSecond = "Gigabytes/Second",
  TerabytesPerSecond = "Terabytes/Second",
  BitsPerSecond = "Bits/Second",
  KilobitsPerSecond = "Kilobits/Second",
  MegabitsPerSecond = "Megabits/Second",
  GigabitsPerSecond = "Gigabits/Second",
  TerabitsPerSecond = "Terabits/Second",
  CountPerSecond = "Count/Second",
  None = "None",
}

export abstract class IMetric {
  abstract setProperty(key: string, value: unknown): void;
  abstract putDimensions(dimensions: Record<string, string>): void;
  abstract putMetric(key: string, value: number, unit?: MetricLoggerUnit): void;
}

interface MetricContext {
  chainId: number;
  networkName: string;
}

export class MetricLogger extends IMetric {
  private log: Logger;

  constructor(context?: MetricContext) {
    super();
    this.log = log;
    if (context) {
      this.log = this.log.child(context);
    }
  }

  public setProperty(key: string, value: unknown): void {
    this.log = this.log.child({ [key]: value });
  }

  public putDimensions(dimensions: Record<string, string>): void {
    this.log = this.log.child(dimensions);
  }

  public putMetric(key: string, value: number, unit?: MetricLoggerUnit): void {
    this.log.info(
      LogCodes.METRIC,
      `[Metric]: ${key}: ${value} | ${unit ?? ""}`,
      { key, value, unit },
    );
  }
}

export let metric: IMetric = new MetricLogger();

export const setGlobalMetric = (_metric: IMetric) => {
  metric = _metric;
};
