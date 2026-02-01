import type { Token } from "@x7/utils"

import { encodePacked, getContractAddress, keccak256 } from "viem"

export class Factory {
  public readonly address: string
  public readonly init_code_hash: string

  constructor(address: string, init_code_hash: string) {
    this.address = address
    this.init_code_hash = init_code_hash
  }

  public computePairAddress(tokenA: Token, tokenB: Token): string {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA] // does safety checks

    // return getCreate2Address(
    //   this.address,
    //   keccak256(
    //     ["bytes"],
    //     [pack(["address", "address"], [token0.address, token1.address])],
    //   ),
    //   this.init_code_hash,
    // );

    return getContractAddress({
      bytecodeHash: this.init_code_hash as `0x${string}`,
      from: this.address as `0x${string}`,
      opcode: "CREATE2",
      salt: keccak256(
        encodePacked(
          ["bytes"],
          [
            encodePacked(
              ["address", "address"],
              [token0.address, token1.address]
            ),
          ]
        )
      ),
    })
  }
}
