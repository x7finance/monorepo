/* oxlint-disable no-restricted-properties */
/* oxlint-disable turbo/no-undeclared-env-vars */
/* oxlint-disable @typescript-eslint/no-empty-function */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
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
import { createContext, useCallback, useContext, useMemo } from "react"
import { fallback, http } from "viem"
import type { Config } from "wagmi"
import { createConfig, WagmiProvider } from "wagmi"

import { useLocalStorage } from "@x7/ui"
import type { ChainId } from "@x7/utils"
import { env } from "~/env"
import { web3Config } from "~/lib/config/web3"

interface Web3ContextType {
  wagmiConfig: Config | null
  transports: Transports
  updateTransports: (newTransports: Transports) => void
}

const Web3Context = createContext<Web3ContextType>({
  wagmiConfig: null,
  transports: {},
  updateTransports: () => {},
})

export const useWeb3Config = () => {
  const { wagmiConfig, updateTransports, transports } = useContext(Web3Context)

  if (!wagmiConfig) {
    throw new Error("useWeb3Config must be used within a Web3Provider")
  }

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

const appInfo = {
  appName: "Xchange",
}

// Lazy-initialize connectors to avoid SSR issues with WalletConnect's indexedDB usage
let connectors: ReturnType<typeof connectorsForWallets> | null = null

function getConnectors() {
  if (connectors) return connectors
  connectors = connectorsForWallets(
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
  return connectors
}

export function Web3Provider(props: Web3ProvidersProps) {
  const { children, initialState } = props
  const [transports, setTransports] = useLocalStorage<Transports>(
    "custom.xchange.transports",
    DEFAULT_TRANSPORTS
  )

  // Build the config synchronously so the provider can render immediately
  // (server + first client paint) instead of flashing null while an effect runs.
  const wagmiConfig = useMemo<Config>(() => {
    const currentConnectors = getConnectors()

    if (Object.keys(transports).length > 0) {
      // @ts-expect-error: todo fix
      return createConfig({
        connectors: [...currentConnectors],
        multiInjectedProviderDiscovery: false,
        ...web3Config,
        transports: Object.fromEntries(
          Object.entries(transports).map(([chainId, urls]) => {
            return [chainId, fallback((urls ?? []).map((url) => http(url)))]
          })
        ),
      })
    }

    return createConfig({
      connectors: [...currentConnectors],
      multiInjectedProviderDiscovery: false,
      ...web3Config,
    })
  }, [transports])

  const updateTransports = useCallback(
    (newTransports: Transports) => {
      setTransports(newTransports)
    },
    [setTransports]
  )

  const theme = useMemo(() => {
    const defaultTheme = darkTheme({
      ...darkTheme.accentColors.purple,
      accentColor: "#34d399",
      borderRadius: "medium",
      fontStack: "system",
    })

    return {
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        accentColorForeground: "#052e16",
        modalText: "#ffffff",
        modalTextDim: "#a1a1aa",
        modalTextSecondary: "#d4d4d8",
      },
    }
  }, [])

  const contextValue = useMemo(
    () => ({ wagmiConfig, transports, updateTransports }),
    [wagmiConfig, transports, updateTransports]
  )

  return (
    <Web3Context.Provider value={contextValue}>
      <WagmiProvider initialState={initialState} config={wagmiConfig}>
        <RainbowKitProvider theme={theme} modalSize="compact" appInfo={appInfo}>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  )
}
