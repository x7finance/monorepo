import React from "react";

import {
  useArbitrumScanApi,
  useBscscanApi,
  useEtherscanApi,
  useOptimismScanApi,
  usePolygonScanApi,
} from "@x7/ui";
import { TextField } from "@x7/ui/text-field";

// Adjust the import paths as needed

const apiProviders = [
  {
    useApiHook: useEtherscanApi,
    placeholder: "Etherscan API key",
  },
  {
    useApiHook: useBscscanApi,
    placeholder: "Bscscan API key",
  },
  {
    useApiHook: usePolygonScanApi,
    placeholder: "PolygonScan API key",
  },
  {
    useApiHook: useArbitrumScanApi,
    placeholder: "ArbiScan API key",
  },
  {
    useApiHook: useOptimismScanApi,
    placeholder: "Optimistic Etherscan API key",
  },
];

function ApiProvider(index: number): {
  api: string;
  placeholder: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const apiProvider = apiProviders[index];

  if (!apiProvider) {
    throw new Error("Invalid API provider index: " + index);
  }

  const [api, setApi] = apiProvider.useApiHook();
  const placeholder = apiProvider.placeholder;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApi(e.target.value);
  };

  return { api, placeholder, handleInputChange };
}

export function SettingsScanView() {
  return (
    <div>
      <div className="mb-4 flex w-full flex-col gap-4">
        <div className="flex w-full">
          <h4 className="text-md font-bold tracking-tight text-zinc-700 dark:text-zinc-300">
            Scan Api Keys
          </h4>
        </div>
        <>
          {apiProviders.map((provider, index) => {
            const { api, placeholder, handleInputChange } = ApiProvider(index);

            return (
              <TextField
                key={provider.placeholder}
                type="text"
                placeholder={placeholder}
                value={api}
                onChange={handleInputChange}
              />
            );
          })}
        </>
      </div>
    </div>
  );
}
