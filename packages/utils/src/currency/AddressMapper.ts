/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import type { ChainId } from "../chain";

export class AddressMapper {
  // Static method to generate a mapping of sister addresses
  static generate(
    addressLists: (Record<number, string[]> | Record<number, string>)[],
  ): Record<string, { chainId: ChainId; tokenAddress: string }[]> {
    // Initializing an empty object to store the result
    const result: Record<string, { chainId: ChainId; tokenAddress: string }[]> =
      {};

    // Iterating over each address list
    for (const addressesByChain of addressLists) {
      // Iterating over each chain and its corresponding address(es)
      Object.entries(addressesByChain).forEach(([chainId, address]) => {
        // Converting the address(es) to an array if it is not already an array
        const sisterAddresses: string[] = Array.isArray(address)
          ? address
          : [address];

        // Iterating over each sister address
        sisterAddresses.forEach((address) => {
          // Generating the current address ID
          const currentId = `${chainId}:${address.toLowerCase()}`;

          // Iterating over each chain and its corresponding address(es) again
          Object.entries(addressesByChain).forEach(([chainId, addresses]) => {
            // Converting the address(es) to an array if it is not already an array
            const currentSisterAddresses: string[] = Array.isArray(addresses)
              ? addresses
              : [addresses];

            // Iterating over each current sister address
            currentSisterAddresses.forEach((address) => {
              // Generating the ID of the current sister address
              const id = `${chainId}:${address.toLowerCase()}`;

              // Checking if the current address ID is not equal to the current sister address ID
              if (currentId !== id) {
                // Adding the current sister address to the result if it does not already exist
                if (!result[currentId]) {
                  result[currentId] = [];
                }

                if (
                  !result[currentId].some(
                    (item) =>
                      item.chainId === Number(chainId) &&
                      item.tokenAddress === address.toLowerCase(),
                  )
                ) {
                  result[currentId].push({
                    chainId: Number(chainId) as ChainId,
                    tokenAddress: address.toLowerCase(),
                  });
                }
              }
            });
          });
        });
      });
    }

    return result;
  }

  // Static method to merge multiple address lists into one
  static merge(
    ...addressLists: Record<number, `0x${string}`>[]
  ): Record<number, string[]> {
    // Initializing an empty object to store the merged result
    const merged: Record<number, string[]> = {};

    // Iterating over each address list
    for (const addressList of addressLists) {
      // Iterating over each chain and its corresponding address
      Object.entries(addressList).forEach(([chainId, address]) => {
        // Converting the address to lowercase and adding it to the merged object
        if (!merged[Number(chainId)]) {
          merged[Number(chainId)] = [address.toLowerCase()];
        } else {
          merged[Number(chainId)]?.push(address.toLowerCase());
        }
      });
    }

    return merged;
  }
}
