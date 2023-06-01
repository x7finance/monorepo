"use client"

import { providerLinkGenerator } from "utils"

import { ConnectKitProvider } from "connectkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { arbitrum, bsc, mainnet, optimism, polygon } from "wagmi/chains"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { LedgerConnector } from "wagmi/connectors/ledger"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { SafeConnector } from "wagmi/connectors/safe"
// import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"

interface Web3WrapperProps {
  children: React.ReactNode
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, optimism, polygon, bsc, arbitrum],
  [
    alchemyProvider({
      apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    }),
    infuraProvider({
      apiKey: `${process.env.NEXT_PUBLIC_INFURA_ID}`,
    }),
    // ANKR
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://rpc.ankr.com/${providerLinkGenerator(chain)?.ankr}/${
          process.env.NEXT_PUBLIC_ANKR_ID
        }`,
      }),
    }),
    // POCKET
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://${
          providerLinkGenerator(chain)?.pocket
        }.gateway.pokt.network/v1/lb/${process.env.NEXT_PUBLIC_POCKET_ID}`,
      }),
    }),
    // BLOCKPI
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://${
          providerLinkGenerator(chain)?.blockpi
        }.blockpi.network/v1/rpc/${process.env.NEXT_PUBLIC_BLOCKPI_ID}`,
      }),
    }),
    // GETBLOCK
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://${providerLinkGenerator(chain)?.getblock}.getblock.io/${
          process.env.NEXT_PUBLIC_GETBLOCK_ID
        }/mainnet/`,
      }),
    }),
    // BLASTAPI
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://${providerLinkGenerator(chain)?.blast}.blastapi.io/${
          process.env.NEXT_PUBLIC_BLAST_ID
        }`,
      }),
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
        {props?.children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
