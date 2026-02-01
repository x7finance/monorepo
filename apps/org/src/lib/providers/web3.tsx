/* oxlint-disable no-restricted-properties */
/* oxlint-disable turbo/no-undeclared-env-vars */
/* oxlint-disable @typescript-eslint/no-empty-function */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import type { ChainId } from "@x7/utils"
import type { Config } from "wagmi"

import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import {
  argentWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets"
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "@wagmi/core/chains"
import { createContext, useContext, useEffect, useState } from "react"
import { fallback, http } from "viem"
import { createConfig, WagmiProvider } from "wagmi"

import { useLocalStorage } from "@x7/ui"
import { env } from "~/env.mjs"
import { web3Config } from "~/lib/config/web3"

interface Web3ContextType {
  wagmiConfig: Config
  transports: Transports
  updateTransports: (newTransports: Transports) => void
}

const Web3Context = createContext<Web3ContextType>({
  // @ts-expect-error: todo fix
  wagmiConfig: null,
  transports: {},
  updateTransports: () => {},
})

export const useWeb3Config = () => {
  const { wagmiConfig, updateTransports, transports } = useContext(Web3Context)

  return {
    wagmiConfig,
    transports,
    updateTransports,
  }
}

interface Web3ProvidersProps {
  children: React.ReactNode
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any
}

const projectId = env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

const appName = "Xchange"

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: "Other",
      wallets: [
        trustWallet,
        argentWallet,
        ledgerWallet,
        injectedWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    projectId,
    appName,
  }
)

const config = createConfig({
  connectors: [...connectors],
  multiInjectedProviderDiscovery: false,
  ...web3Config,
})

type Transports = Partial<Record<ChainId, string[]>>

const MAINNET_TRANSPORTS = {
  [mainnet.id]: [
    env.NEXT_PUBLIC_DEFAULT_ETHER_RPC,
    env.NEXT_PUBLIC_DEFAULT_ETHER_RPC_FALLBACK,
  ],
  [bsc.id]: [
    env.NEXT_PUBLIC_DEFAULT_BSC_RPC,
    env.NEXT_PUBLIC_DEFAULT_BSC_RPC_FALLBACK,
  ],
  [polygon.id]: [
    env.NEXT_PUBLIC_DEFAULT_POLY_RPC,
    env.NEXT_PUBLIC_DEFAULT_POLY_RPC_FALLBACK,
  ],
  [optimism.id]: [
    env.NEXT_PUBLIC_DEFAULT_OPTI_RPC,
    env.NEXT_PUBLIC_DEFAULT_OPTI_RPC_FALLBACK,
  ],
  [arbitrum.id]: [
    env.NEXT_PUBLIC_DEFAULT_ARB_RPC,
    env.NEXT_PUBLIC_DEFAULT_ARB_RPC_FALLBACK,
  ],
  [base.id]: [
    env.NEXT_PUBLIC_DEFAULT_BASE_RPC,
    env.NEXT_PUBLIC_DEFAULT_BASE_RPC_FALLBACK,
  ],
}

const TESTNET_TRANSPORTS = {
  [sepolia.id]: [env.NEXT_PUBLIC_DEFAULT_ETHER_TESTNET_RPC],
  [baseSepolia.id]: [env.NEXT_PUBLIC_DEFAULT_BASE_TESTNET_RPC],
  [arbitrumSepolia.id]: [env.NEXT_PUBLIC_DEFAULT_ARB_TESTNET_RPC],
  [bscTestnet.id]: [env.NEXT_PUBLIC_DEFAULT_BSC_TESTNET_RPC],
  [optimismSepolia.id]: [env.NEXT_PUBLIC_DEFAULT_OPTI_TESTNET_RPC],
  [polygonAmoy.id]: [env.NEXT_PUBLIC_DEFAULT_POLY_TESTNET_RPC],
}

const DEFAULT_TRANSPORTS = {
  ...MAINNET_TRANSPORTS,
  ...(process.env.NODE_ENV === "development" ? TESTNET_TRANSPORTS : {}),
}

export function Web3Provider(props: Web3ProvidersProps) {
  const { children, initialState } = props
  const [transports, setTransports] = useLocalStorage<Transports>(
    "custom.xchange.transports",

    DEFAULT_TRANSPORTS
  )

  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null)

  useEffect(() => {
    if (Object.keys(transports).length > 0) {
      setWagmiConfig(
        // @ts-expect-error: todo fix
        createConfig({
          connectors: [...connectors],
          multiInjectedProviderDiscovery: false,
          ...web3Config,
          transports: Object.fromEntries(
            Object.entries(transports).map(([chainId, urls]) => {
              // oxlint-disable-next-line @typescript-eslint/no-unnecessary-condition
              return [chainId, fallback((urls || []).map((url) => http(url)))]
            })
          ),
        })
      )
    } else {
      setWagmiConfig(config)
    }
  }, [transports])

  const updateTransports = (newTransports: Transports) => {
    setTransports(newTransports)
  }

  if (!wagmiConfig) {
    return null
  }

  return (
    <Web3Context.Provider
      value={{
        wagmiConfig,
        transports,
        updateTransports,
      }}
    >
      <WagmiProvider initialState={initialState} config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </Web3Context.Provider>
  )
}
