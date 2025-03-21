"use client";

import React, { memo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@x7/ui/card";

import {
  SettingsModule,
  SettingsOverlay,
} from "~/lib/components/core/settings";
import { X7SwapForm } from "../swap/swap-form";
import { DrpcPartner } from "./drpc-partner";

// import { MarketingBlurb } from "./marketing-blurb";

const MemoizedX7SwapForm = memo(X7SwapForm);

export function XChangeSwap({
  compactView = false,
}: {
  compactView?: boolean;
}) {
  return (
    <Card className="w-full flex-col border-0 bg-transparent shadow-none sm:max-w-md">
      {!compactView && (
        <CardHeader className="w-full justify-between space-y-1 px-0 pt-4 pb-0 sm:p-6 sm:pl-0">
          <div className="flex items-center justify-between space-x-4">
            <CardTitle
              tag={"h1"}
              className="text-left text-zinc-900 dark:text-zinc-100"
            >
              Trade
            </CardTitle>
          </div>
        </CardHeader>
      )}
      <CardContent className="grid w-full gap-2 p-0">
        <SettingsOverlay
          modules={[
            SettingsModule.SlippageTolerance,
            SettingsModule.ImplementationChoices,
          ]}
        />
        <MemoizedX7SwapForm />
        <DrpcPartner />
        {/* <MarketingBlurb compactView={compactView} /> */}
      </CardContent>
    </Card>
  );
}
