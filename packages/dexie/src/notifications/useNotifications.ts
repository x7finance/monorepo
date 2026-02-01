import type { ResolvedNotification } from "./types"

import { useLiveQuery } from "dexie-react-hooks"
import groupBy from "lodash.groupby"

import { db } from "../db"

export const useNotifications = ({
  account,
}: {
  account: `0x${string}` | undefined
}): Record<string, ResolvedNotification[]> | never[] | undefined => {
  return useLiveQuery(async () => {
    if (!account) return []

    const notifications = await db.notifications
      .where("account")
      .equals(account)
      .sortBy("groupTimestamp")
    const group = groupBy(notifications, "groupTimestamp")

    return Object.entries(group).reduce<Record<string, ResolvedNotification[]>>(
      (acc, cur) => {
        acc[cur[0]] = [...cur[1]].sort((a, b) => b.timestamp - a.timestamp)
        return acc
      },
      {}
    )
  }, [account])
}
