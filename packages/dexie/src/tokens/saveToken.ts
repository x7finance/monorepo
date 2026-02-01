import type { SavedToken } from "./types"

/* oxlint-disable @typescript-eslint/restrict-template-expressions */
import { db } from "../db"

export const saveTokens = async ({ tokens }: { tokens: SavedToken[] }) => {
  try {
    await db.tokens.bulkPut(tokens)
  } catch (error) {
    console.error(`${error}`)
  }
}
