/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useAccount } from "wagmi";

import { cn } from "@x7/css";
import type { ResolvedNotification } from "@x7/dexie";
import { useNotifications } from "@x7/dexie";
import { AlertCircleIcon, CheckCircleIcon, ExternalLinkIcon } from "@x7/icons";
import { Badge } from "@x7/ui/badge";
import { Card, CardContent } from "@x7/ui/card";
import { CircleLoading } from "@x7/ui/circle-loading";
import { ScrollArea } from "@x7/ui/scroll-area";
import { Chain } from "@x7/utils";

export function NotificationsPanel() {
  const { address } = useAccount();
  const notifications = useNotifications({ account: address });

  if (!notifications) {
    return (
      <div className="flex h-full items-center justify-center">
        <CircleLoading containerClass="h-4 w-4" />
      </div>
    );
  }
  return <NotificationsFeed notifications={notifications} />;
}

type NotificationStatus = "pending" | "completed" | "failed";

const statusIcons: Record<NotificationStatus, React.ReactNode> = {
  pending: <CircleLoading containerClass="inline-flex mr-1 h-3 w-3" />,
  completed: <CheckCircleIcon className="h-3 w-3 text-emerald-500" />,
  failed: <AlertCircleIcon className="h-3 w-3 text-red-500" />,
};

const statusColors: Record<NotificationStatus, string> = {
  pending:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-1 dark:ring-zinc-500 dark:ring-opacity-50",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-1 dark:ring-emerald-500 dark:ring-opacity-50",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:ring-1 dark:ring-red-500 dark:ring-opacity-50",
};

function NotificationsFeed({
  notifications,
}: {
  notifications: never[] | Record<string, ResolvedNotification[]>;
}) {
  const notificationArray = Array.isArray(notifications)
    ? notifications
    : Object.values(notifications).flat();

  if (!notificationArray.length) {
    return null;
  }

  return (
    <Card className="h-full w-full max-w-md">
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          {notificationArray.map((notification) => {
            const txUrl = notification.txHash
              ? Chain.from(notification.chainId)?.getTxUrl(notification.txHash)
              : "";

            return (
              <div
                key={notification.id}
                className={cn(
                  `border-b border-zinc-300 p-3 dark:border-zinc-700`,
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`px-1.5 py-0.5 text-[10px] font-medium ${
                        statusColors[notification.status as NotificationStatus]
                      }`}
                    >
                      {statusIcons[notification.status as NotificationStatus]}
                      <span className="ml-1">{notification.status}</span>
                    </Badge>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="py-2 text-xs font-medium leading-tight text-zinc-800 dark:text-zinc-100">
                    {
                      // @ts-expect-error: not null
                      notification.fullSummary?.[
                        notification.status ?? "completed"
                      ]
                    }
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-muted-foreground">
                      Tx: {notification.txHash!.slice(0, 6)}...
                      {notification.txHash!.slice(-4)}
                    </span>
                    {txUrl && (
                      <a
                        href={txUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-zinc-500 hover:text-secondary-foreground dark:hover:text-zinc-200"
                      >
                        View on chain
                        <ExternalLinkIcon className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
