import { providerLinkGenerator } from 'utils';

import SEO from '../../next-seo.config';
import { CustomToaster } from '../components/customToaster';
import { Layout } from '../components/layout';

import '../styles/tailwind.css';

import { slugifyWithCounter } from '@sindresorhus/slugify';
import { ConnectKitProvider } from 'connectkit';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { LedgerConnector } from 'wagmi/connectors/ledger';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import 'focus-visible';

import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import { Space_Mono } from 'next/font/google';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { arbitrum, bsc, mainnet, optimism, polygon } from 'wagmi/chains';
import { SafeConnector } from 'wagmi/connectors/safe';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
});

function getNodeText(node: any) {
  let text = '';
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child;
    }
    text += getNodeText(child);
  }
  return text;
}

function collectHeadings(nodes: any, slugify = slugifyWithCounter()): any {
  let sections = [];

  for (let node of nodes) {
    if (node.name === 'h2' || node.name === 'h3') {
      let title = getNodeText(node);
      if (title) {
        let id = slugify(title);
        node.attributes.id = id;
        if (node.name === 'h3') {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`'
            );
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          });
        } else {
          sections.push({ ...node.attributes, title, children: [] });
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify));
  }

  return sections;
}
const { chains, provider } = configureChains(
  [mainnet, optimism, polygon, bsc, arbitrum],
  [
    alchemyProvider({
      apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      priority: 1,
      // stallTimeout: 1_000,
    }),
    infuraProvider({
      apiKey: `${process.env.NEXT_PUBLIC_INFURA_ID}`,
      priority: 2,
      // stallTimeout: 1_000,
    }),
    // ANKR
    jsonRpcProvider({
      priority: 3,
      // stallTimeout: 250,
      rpc: (chain) => ({
        http: `https://rpc.ankr.com/${providerLinkGenerator(chain)?.ankr}/${
          process.env.NEXT_PUBLIC_ANKR_ID
        }`,
      }),
    }),
    // POCKET
    jsonRpcProvider({
      priority: 4,
      // stallTimeout: 250,
      rpc: (chain) => ({
        http: `https://${
          providerLinkGenerator(chain)?.pocket
        }.gateway.pokt.network/v1/lb/${process.env.NEXT_PUBLIC_POCKET_ID}`,
      }),
    }),
    // BLOCKPI
    jsonRpcProvider({
      priority: 5,
      // stallTimeout: 250,
      rpc: (chain) => ({
        http: `https://${
          providerLinkGenerator(chain)?.blockpi
        }.blockpi.network/v1/rpc/${process.env.NEXT_PUBLIC_BLOCKPI_ID}`,
      }),
    }),
    // GETBLOCK
    jsonRpcProvider({
      priority: 6,
      stallTimeout: 250,
      rpc: (chain) => ({
        http: `https://${providerLinkGenerator(chain)?.getblock}.getblock.io/${
          process.env.NEXT_PUBLIC_GETBLOCK_ID
        }/mainnet/`,
      }),
    }),
    // BLASTAPI
    jsonRpcProvider({
      priority: 7,
      // stallTimeout: 250,
      rpc: (chain) => ({
        http: `https://${providerLinkGenerator(chain)?.blast}.blastapi.io/${
          process.env.NEXT_PUBLIC_BLAST_ID
        }`,
      }),
    }),
    // PUBLIC
    publicProvider({
      priority: 8,
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new LedgerConnector({
      chains,
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'x7finance',
      },
    }),
    new SafeConnector({
      chains,
    }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  let title = pageProps.markdoc?.frontmatter.title;
  let tags = pageProps.markdoc?.frontmatter.tags;
  let date = pageProps.markdoc?.frontmatter.date;

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc?.content)
    : [];

  return (
    <>
      <style jsx global>
        {`
          :root {
            --space-font: ${spaceMono.style.fontFamily};
          }
          #__next {
            height: 100%;
          }
        `}
      </style>
      <WagmiConfig client={client}>
        <ConnectKitProvider
          theme="rounded"
          options={{
            initialChainId: 0,
          }}
        >
          <DefaultSeo {...SEO} />
          <Layout
            title={title}
            tags={tags}
            date={date}
            tableOfContents={tableOfContents}
          >
            <Component {...pageProps} />
          </Layout>
          <CustomToaster />
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
}
