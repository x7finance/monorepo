"use client";

import { useState } from "react";

import { ManageCoinFormAddress } from "./manage-coin-form-address";
import { ManageCoinFormSearch } from "./manage-coin-form-search";

export function ManageCoinForm() {
  const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(null);

  return (
    <div>
      {!contractAddress ? (
        <ManageCoinFormSearch onSuccess={(address: `0x${string}`) => setContractAddress(address)} />
      ) : (
        <ManageCoinFormAddress contractAddress={contractAddress} />
      )}
    </div>
  );
}
