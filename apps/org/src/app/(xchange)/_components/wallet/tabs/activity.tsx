/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { Card, CardContent } from "@x7/ui/card";
import { TabsContent } from "@x7/ui/tabs";

import { UnderConstruction } from "~/lib/components/core/under-construction";
import { useAccountHistory } from "~/lib/hooks/account/useAccountHistory";
import { ActivityAlchemyTransaction } from "./activity-alchemy-transaction";
import { ActivityScannerTransaction } from "./activity-scanner-transaction";

interface Transaction {
  hash: string;
  value: string;
  asset: string;
  timeStamp: string;
  functionName: string;
  gasPrice: string;
  blockNumber: string;
}

const useFetchActivityData = (url: string, queryString: string) => {
  return useQuery({
    queryKey: ["activityData", url, queryString],
    queryFn: async () => {
      if (!url || !queryString) {
        throw new Error("URL or queryString is missing");
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: queryString,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: Boolean(url) && Boolean(queryString),
  });
};

export function ActivityTab() {
  const { address } = useAccount();
  const containerRef = useRef(null);
  const [tx, setTx] = useState<any>(null);
  const [_error, setError] = useState<string | null>(null);

  const data = useAccountHistory();
  const url = data.url || "";
  const queryString = data.queryString
    ? decodeURIComponent(data.queryString)
    : "";

  const { data: queryData, error: queryError } = useFetchActivityData(
    url,
    queryString,
  );

  useEffect(() => {
    if (queryError) {
      setError(`Error fetching transaction history: ${queryError.message}`);
    } else if (queryData) {
      setTx(queryData);
    }
  }, [queryData, queryError]);

  const renderTransactions = () => {
    if (!address || !tx?.result?.toString()) {
      return <UnderConstruction type="small" />;
    }

    if (tx.result?.length > 0 && tx.result.map) {
      return tx.result.map((transaction: Transaction) => (
        <ActivityScannerTransaction
          key={transaction.hash}
          transaction={transaction}
        />
      ));
    }

    if (tx.result?.transfers?.length > 0 && tx.result.transfers.map) {
      return [...tx.result.transfers]
        .reverse()
        .map((transaction) => (
          <ActivityAlchemyTransaction
            key={transaction.hash}
            transaction={transaction}
          />
        ));
    }

    return null;
  };

  return (
    <TabsContent value="activity">
      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardContent className="space-y-2 p-0" ref={containerRef}>
          {renderTransactions()}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
