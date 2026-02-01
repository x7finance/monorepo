/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "../db";
import { isPromise } from "./types";
import type { PromiseNotification, ResolvedNotification } from "./types";

export const createNotification = async (
  payload: PromiseNotification | ResolvedNotification,
) => {
  if (!payload.account) {
    console.error("Cant create notification for account: undefined");
    return;
  }

  if (isPromise(payload)) {
    let id;
    if (!payload.id) {
      id = await db.notifications.add({
        account: payload.account,
        chainId: payload.chainId,
        href: payload.href ?? "",
        txHash: payload.txHash ?? "",
        summary: payload.summary.pending,
        type: payload.type,
        timestamp: payload.timestamp,
        groupTimestamp: payload.groupTimestamp,
        fullSummary: payload.summary,
        status: "pending",
      });
    } else {
      id = payload.id;
    }

    payload.promise
      .then(() =>
        db.notifications.update(id, {
          summary: payload.summary.completed,
          status: "completed",
        }),
      )
      .catch(() =>
        db.notifications.update(id, {
          summary: payload.summary.failed,
          status: "failed",
        }),
      );
  } else {
    // oxlint-disable-next-line @typescript-eslint/no-floating-promises
    db.notifications.add({
      account: payload.account,
      chainId: payload.chainId,
      href: payload.href ?? "",
      txHash: payload.txHash ?? "",
      summary: payload.summary,
      type: payload.type,
      timestamp: payload.timestamp,
      groupTimestamp: payload.groupTimestamp,
      fullSummary: payload.fullSummary,
      id: payload.id,
      status: "completed",
    });
  }
};
