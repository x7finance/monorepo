/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
/* oxlint-disable @typescript-eslint/no-extraneous-class */
import type { ChainId } from "../chain"

export class AddressMapper {
  // Static method to generate a mapping of sister addresses
  static generate(
    addressLists: (Record<number, string[]> | Record<number, string>)[]
  ): Record<string, { chainId: ChainId; tokenAddress: string }[]> {
    // Initializing an empty object to store the result
    const result: Record<string, { chainId: ChainId; tokenAddress: string }[]> =
      {}

    // Iterating over each address list
    for (const addressesByChain of addressLists) {
      // Iterating over each chain and its corresponding address(es)
      Object.entries(addressesByChain).forEach(([outerChainId, outerAddr]) => {
        const sisterAddresses: string[] = Array.isArray(outerAddr)
          ? outerAddr
          : [outerAddr]

        sisterAddresses.forEach((sisterAddr) => {
          const currentId = `${outerChainId}:${sisterAddr.toLowerCase()}`

          Object.entries(addressesByChain).forEach(
            ([innerChainId, innerAddresses]) => {
              const currentSisterAddresses: string[] = Array.isArray(
                innerAddresses
              )
                ? innerAddresses
                : [innerAddresses]

              currentSisterAddresses.forEach((innerAddr) => {
                const id = `${innerChainId}:${innerAddr.toLowerCase()}`

                if (currentId !== id) {
                  if (!result[currentId]) {
                    result[currentId] = []
                  }

                  if (
                    !result[currentId].some(
                      (item) =>
                        item.chainId === Number(innerChainId) &&
                        item.tokenAddress === innerAddr.toLowerCase()
                    )
                  ) {
                    result[currentId].push({
                      chainId: Number(innerChainId) as ChainId,
                      tokenAddress: innerAddr.toLowerCase(),
                    })
                  }
                }
              })
            }
          )
        })
      })
    }

    return result
  }

  // Static method to merge multiple address lists into one
  static merge(
    ...addressLists: Record<number, `0x${string}`>[]
  ): Record<number, string[]> {
    // Initializing an empty object to store the merged result
    const merged: Record<number, string[]> = {}

    // Iterating over each address list
    for (const addressList of addressLists) {
      // Iterating over each chain and its corresponding address
      Object.entries(addressList).forEach(([chainId, address]) => {
        // Converting the address to lowercase and adding it to the merged object
        if (!merged[Number(chainId)]) {
          merged[Number(chainId)] = [address.toLowerCase()]
        } else {
          merged[Number(chainId)]?.push(address.toLowerCase())
        }
      })
    }

    return merged
  }
}
