import type { PromiseNotification, ResolvedNotification } from "./types"

/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "../db"

import { isPromise } from "./types"

export const createNotification = async (
  payload: PromiseNotification | ResolvedNotification
) => {
  if (!payload.account) {
    console.error("Cant create notification for account: undefined")
    return
  }

  if (isPromise(payload)) {
    const id = await db.notifications.add({
      account: payload.account,
      chainId: payload.chainId,
      href: payload.href ?? "",
      txHash: payload.txHash ?? "",
      summary: payload.summary.pending,
      type: payload.type,
      timestamp: payload.timestamp,
      groupTimestamp: payload.groupTimestamp,
      status: "pending",
    })

    payload.promise
      .then(() =>
        db.notifications.update(id, {
          summary: payload.summary.completed,
          status: "completed",
        })
      )
      .catch(() =>
        db.notifications.update(id, {
          summary: payload.summary.failed,
          status: "failed",
        })
      )
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
      status: "completed",
    })
  }
}
