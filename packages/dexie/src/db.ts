import type { Table } from "dexie"
import { Dexie } from "dexie"

import type { ResolvedNotification } from "./notifications/types.js"
import type { SavedToken } from "./tokens/types.js"

export class X7Dexie extends Dexie {
  notifications!: Table<ResolvedNotification & { account: string }>
  tokens!: Table<SavedToken>

  constructor() {
    super("x7")
    this.version(2).stores({
      notifications:
        "++id, account, chainId, href, txHash, summary, type, timestamp, groupTimestamp, status, fullSummary",
      tokens: "id, address, chainId, decimals, name, symbol, status",
    })
  }
}

export const db = new X7Dexie()
