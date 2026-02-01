/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
import type { FC } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAccount, useChainId } from "wagmi";

import type { NotificationType, ResolvedNotification } from "@x7/dexie";
import { useNotifications } from "@x7/dexie";
import { createToast } from "@x7/ui";
import type { ChainId } from "@x7/utils";

import { useWeb3Config } from "./web3";

interface TransasctionStoreState {
  state: {
    notifications: Record<string, ResolvedNotification[]> | never[];
  };
  mutate: {
    trackTransaction: (newTransactionRequest: TransactionRequest) => void;
  };
}

interface TransactionStoreProviderProps {
  children: React.ReactNode;
}

interface Error {
  message: string;
  code: number;
  data?: unknown;
  stack?: string;
}

interface TransactionRequest {
  id?: number;
  type: NotificationType;
  txHash: `0x${string}`;
  summary: {
    pending: string;
    completed: string;
    failed: string;
  };
  onSuccess?: (txHash?: string) => void;
  onFail?: (err: Error) => void;
}

const TransactionStoreContext = createContext<TransasctionStoreState>(
  {} as TransasctionStoreState,
);

export const TransactionStoreProvider: FC<TransactionStoreProviderProps> = ({
  children,
}) => {
  const chainId = useChainId() as ChainId;
  const { address } = useAccount();
  const { wagmiConfig } = useWeb3Config();
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(
    new Set(),
  );

  const notifications = useNotifications({ account: address });

  const trackTransaction = (newTransactionRequest: TransactionRequest) => {
    const ts = new Date().getTime();

    const promiseSub = waitForTransactionReceipt(wagmiConfig, {
      hash: newTransactionRequest.txHash,
      pollingInterval: 2_500,
      retryDelay: 2_500,
    });

    void createToast({
      account: address,
      type: newTransactionRequest.type,
      chainId,
      txHash: newTransactionRequest.txHash,
      promise: promiseSub,
      summary: newTransactionRequest.summary,
      groupTimestamp: ts,
      timestamp: ts,
      id: newTransactionRequest.id ?? undefined,
    });

    setShownNotifications((prevState) => {
      return prevState.add(newTransactionRequest.txHash);
    });

    void promiseSub
      .then(({ transactionHash }) => {
        if (newTransactionRequest.onSuccess) {
          newTransactionRequest.onSuccess(transactionHash);
        }
      })
      .catch((err: Error) => {
        if (newTransactionRequest.onFail) {
          newTransactionRequest.onFail(err);
        }
      });
  };

  useEffect(() => {
    if (notifications)
      Object.entries(notifications).forEach(
        ([_, notifs]: [string, ResolvedNotification[]]) => {
          const notif = notifs[notifs.length - 1]!;
          if (
            notif.status === "pending" &&
            !shownNotifications.has(notif.txHash!)
          ) {
            void trackTransaction({
              id: notif.id,
              summary: notif.fullSummary!,
              type: notif.type,
              txHash: notif.txHash! as `0x${string}`,
            });
          }
        },
      );
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const builtState = {
    state: {
      notifications: notifications!,
    },
    mutate: {
      trackTransaction,
    },
  };

  return (
    <TransactionStoreContext.Provider value={builtState}>
      {children}
    </TransactionStoreContext.Provider>
  );
};

export const useTransactionStore = () => {
  const context = useContext(TransactionStoreContext);
  if (!context) {
    throw new Error(
      "Hook can only be used inside Transaction Store State Context",
    );
  }

  return context;
};
