"use client"

import { ConnectKitProvider } from "connectkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { arbitrum, bsc, mainnet, optimism, polygon } from "wagmi/chains"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { LedgerConnector } from "wagmi/connectors/ledger"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { SafeConnector } from "wagmi/connectors/safe"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import { ConnectionComponent } from "@/components/web3/connect-button"

interface Web3WrapperProps {
  children: React.ReactNode
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, polygon, bsc, arbitrum],
  [
    alchemyProvider({
      apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    }),
    // PUBLIC
    publicProvider(),
  ]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new LedgerConnector({
      chains,
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "x7finance",
      },
    }),
    new SafeConnector({
      chains,
    }),
    new WalletConnectConnector({
      options: {
        projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
      },
    }),
  ],
})

export function Web3Wrapper(props: Web3WrapperProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        theme="rounded"
        options={{
          initialChainId: 0,
        }}
      >
        <ConnectionComponent />
        {props?.children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
