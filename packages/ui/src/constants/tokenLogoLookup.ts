/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ChainShortNameEnum, LogCodes } from "@x7/utils";

import { log } from "../utils/logger";

interface ListTokenType {
  address: string;
  chainId: number;
  logoURI: string;
}

class TokenLogoLookupTable {
  private dict = new Map<string, string[]>();

  constructor() {
    void this.initialize();
  }

  private async fetchList(chain: string, listName: string) {
    const url = `https://www.x7finance.org/lists/${listName}/${chain}.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Oops, we haven't got JSON!");
      }
      return response.json();
    } catch (error) {
      log.error(LogCodes.TOKEN_LIST_FAIL, `Failed to fetch list at ${url}:`, {
        error,
      });

      return null;
    }
  }

  private async initialize() {
    const listNames = ["coingecko", "xchange"];
    const fetchPromises = [];

    for (const chain of Object.values(ChainShortNameEnum)) {
      for (const listName of listNames) {
        fetchPromises.push(this.fetchList(chain, listName));
      }
    }

    const lists = await Promise.all(fetchPromises);

    for (const listData of lists) {
      if (!listData) {
        continue;
      }

      listData.tokens.forEach((token: ListTokenType) => {
        if (token.logoURI) {
          const lowercaseAddress = token.address.toLowerCase();
          const key = `${lowercaseAddress}:${token.chainId}`;
          const currentEntry = this.dict.get(key);
          if (currentEntry) {
            currentEntry.push(token.logoURI);
          } else {
            this.dict.set(key, [token.logoURI]);
          }
        }
      });
    }
  }

  getIcons(address?: string | null, chainId: number | null = 1) {
    if (!address) return undefined;

    return this.dict.get(address.toLowerCase() + ":" + chainId);
  }
}

export default new TokenLogoLookupTable();
