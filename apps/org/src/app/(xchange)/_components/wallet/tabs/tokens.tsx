"use client";

import React, { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";

import { Card, CardContent } from "@x7/ui/card";
import { TabsContent } from "@x7/ui/tabs";
import type { ChainId } from "@x7/utils";

import { DefaultTokenAdditionForm } from "~/app/(xchange)/_components/swap/(drawers)/default-token-addition-form";
import { TokenListContent } from "~/lib/components/utils/token-list-content";

// Wrap TokenListContent with React.memo to prevent unnecessary re-renders
const MemoizedTokenListContent = React.memo(TokenListContent);

// Memoize DefaultTokenAdditionForm to prevent unnecessary re-renders
const MemoizedDefaultTokenAdditionForm = React.memo(DefaultTokenAdditionForm);

export function TokensTab() {
  const { chain } = useAccount();
  const chainId = chain?.id;

  // Memoize the onSelect function to prevent it from being recreated on every render
  const handleSelect = useCallback(() => null, []);

  // Memoize the chainId to prevent unnecessary re-renders
  const memoizedChainId = useMemo(() => chainId as ChainId, [chainId]);

  return (
    <TabsContent value="tokens">
      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardContent className="space-y-2 p-0">
          <MemoizedTokenListContent
            open={true}
            includeNative={false}
            id={"wallet-tokens-list"}
            selected={undefined}
            onSelect={handleSelect}
            chainId={memoizedChainId}
            hidePinnedTokens={false}
            hideSearch={true}
          />
          <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />
          <div className="mt-8 flex w-full flex-col gap-4">
            <MemoizedDefaultTokenAdditionForm />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
