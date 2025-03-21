/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { db } from "../db";
import type { SavedToken } from "./types";

export const getToken = async ({
  chainId,
  address,
}: {
  chainId: number | undefined;
  address: string | undefined | null;
}): Promise<SavedToken | undefined> => {
  if (!chainId || typeof address !== "string") return;
  try {
    const token = await db.tokens
      .where("id")
      .equals(`${chainId}:${address.toLowerCase()}`)
      .first();
    return token;
  } catch (error) {
    console.error(`${error}`);
  }
};
