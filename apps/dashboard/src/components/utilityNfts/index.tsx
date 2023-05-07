import { formatEther } from '@ethersproject/units';
import {
  CubeTransparentIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import { CheckCircleIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { X7NFT } from 'common-files';
import { ConnectKitButton } from 'connectkit';
import { BigNumber } from 'ethers';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from 'utils';
import { useContractReads, useNetwork, useSwitchNetwork } from 'wagmi';

import { ONE_MILLION } from '../../lib/constants';
import { useContractTx } from '../../lib/hooks/useContractWrite';
import { ChainEnum, ContractsEnum } from '../../lib/types';
import {
  chainsArray,
  generateChainAbbreviation,
  generateChainBase,
} from '../../lib/utils/chainFormatters';
import { Button } from '../button';

export function UtitlityNfts() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4"
    >
      {utilityNftData?.map((n: any) => {
        return (
          <li
            key={`utility-nft-${n.slug}`}
            className={cn(
              `group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 bg-zinc-900/5 shadow-lg`
            )}
          >
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5  dark:bg-white/2.5 dark:ring-white/10"></div>
            <UtilityNftData nft={n} />
          </li>
        );
      })}
    </ul>
  );
}

function UtilityNftData({ nft }: any) {
  const { chain } = useNetwork();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mintCount, setMintCount] = useState(1);

  const { data } = useContractReads({
    contracts: [
      {
        address: nft.contract,
        abi: X7NFT,
        functionName: 'mintingOpen',
      },
      {
        address: nft.contract,
        abi: X7NFT,
        functionName: 'mintPrice',
      },
    ],
  });

  // @ts-expect-error
  const { write: writeMany } = useContractTx({
    chainId: chain?.id,
    args: [
      {
        mode: 'recklesslyUnprepared',
        address: nft.contract,
        abi: X7NFT,
        functionName: 'mintMany',
      },
    ],
  });

  const price =
    BigNumber?.isBigNumber(data?.[1]) && !!data?.[0]
      ? formatEther(data?.[1])
      : 0;

  const mintNft = useCallback(
    async (quantity: number) => {
      try {
        // @ts-ignore
        if (quantity <= 0 && price > 0) {
          return toast.error('Please ensure you are minting at least 1 NFT');
        }

        if (!!writeMany) {
          await writeMany({
            recklesslySetUnpreparedArgs: [
              [quantity],
              // @ts-expect-error
              { gasLimit: ONE_MILLION, value: data?.[1]?.mul(quantity) },
            ],
          });
        }
      } catch (error: any) {
        console.error(error);
      }
    },
    [data]
  );

  const { switchNetworkAsync } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    onError(error) {
      console.error(error);
    },
  });

  return (
    <>
      <div>
        <Image
          height={200}
          width={200}
          priority={true}
          className="w-full h-auto"
          src={`/nfts/${nft.slug}.gif`}
          alt="Utility NFT Image"
        />
      </div>

      <p
        className={cn(
          'relative mx-auto mt-3 flex h-8 text-2xl tracking-tight text-slate-900 dark:text-slate-100'
        )}
      >
        {nft?.name}
      </p>
      <div className="mx-auto font-bold text-transparent bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text">
        {price ?? nft?.price} {generateChainAbbreviation(chain?.id)}
      </div>
      <p
        className={cn(
          'xl:48 mt-3 h-48 px-3 text-sm text-slate-700 dark:text-slate-400 sm:h-60 md:h-48 lg:h-80'
        )}
      >
        {nft?.description}
      </p>
      <div className="px-4 mt-2">
        <ul
          role="list"
          className={cn(
            '-my-2 h-40 divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-300 sm:h-48 md:h-48 lg:h-56'
          )}
        >
          {nft?.benefits.map((b: any, idx: any) => (
            <li
              key={`${nft?.slug}-${idx}-benefit`}
              className="flex w-full py-2"
            >
              <CheckCircleIcon
                className={cn('h-6 w-6 flex-none text-sky-500')}
              />
              <span className="ml-4 text-slate-700 dark:text-slate-300">
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bottom-1 mx-auto mb-0.5 flex w-full flex-col items-center justify-center">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`${generateChainBase(chain?.id)}/address/${nft.contract}`}
          className="relative text-xs underline text-slate-700 dark:text-slate-300"
        >
          contract
        </a>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          mint on other chains
        </p>
        <div className="flex flex-shrink-0 space-x-1">
          {chainsArray.map((c, id) => (
            <ConnectKitButton.Custom key={`${id}-${c.id}`}>
              {({ isConnected, show }) => {
                return (
                  <button
                    onClick={async (e) => {
                      e.preventDefault();

                      if (!isConnected && show) {
                        show();
                        return;
                      }

                      await switchNetworkAsync(c?.id);
                    }}
                    key={`${nft.slug}-${id}-chain`}
                    className={cn(
                      chain?.id === c?.id
                        ? ``
                        : `grayscale transition-all duration-200 hover:grayscale-0`,
                      'cursor-pointer'
                    )}
                  >
                    <span>{c.icon}</span>
                  </button>
                );
              }}
            </ConnectKitButton.Custom>
          ))}
        </div>
      </div>
      <div className="relative mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex -mt-px divide-x divide-slate-200 dark:divide-slate-800">
          <div className="relative flex flex-1 w-0">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${nft?.exchanges[chain?.id ?? 1]}`}
              className="relative inline-flex items-center justify-center flex-1 w-0 py-4 -mr-px text-sm font-medium rounded-bl-lg text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Squares2X2Icon className="w-5 h-5 " aria-hidden="true" />
              <span className="ml-3">Trade</span>
            </a>
          </div>
          <div className="flex flex-1 w-0 -ml-px overflow-hidden">
            <a
              onClick={(e) => {
                e.preventDefault();

                setDrawerOpen(!drawerOpen);
              }}
              className={cn(
                `hover:to-sky-90 0 relative inline-flex w-0 flex-1 cursor-pointer items-center justify-center rounded-br-lg bg-gradient-to-r from-sky-500 to-sky-700 py-4 text-sm font-medium text-slate-100 hover:from-sky-400 hover:to-sky-600`
              )}
            >
              <CubeTransparentIcon
                className="w-5 h-5 text-slate-100"
                aria-hidden="true"
              />
              <span className="ml-3">
                {data?.[0] ? (drawerOpen ? `Close` : 'Mint') : `Not Ready`}
              </span>
            </a>
          </div>
        </div>
      </div>
      <div
        className={cn(
          drawerOpen ? 'h-32' : 'h-0',
          'bg-slate-200 transition-all duration-500 dark:bg-slate-800'
        )}
      >
        <div className="flex flex-col items-center justify-center px-4 mt-2 text-sm">
          <p>How many would you like to mint?</p>
          <div
            className="inline-flex mt-3 -space-x-px rounded-md isolate"
            aria-label="Mint Count"
          >
            <a
              onClick={(e) => {
                e.preventDefault();

                setMintCount(mintCount - 1 < 1 ? 1 : mintCount - 1);
              }}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium bg-white border cursor-pointer rounded-l-md border-slate-300 text-slate-500 hover:bg-slate-50 focus:z-20"
            >
              <span className="sr-only">Subtract</span>
              <MinusCircleIcon className="w-5 h-5" aria-hidden="true" />
            </a>

            <span className="relative z-10 inline-flex items-center px-4 py-2 text-lg font-bold text-indigo-600 border border-indigo-500 bg-indigo-50 focus:z-20">
              {mintCount}
            </span>

            <a
              onClick={(e) => {
                e.preventDefault();

                if (mintCount >= nft.maxMint) {
                  toast.remove();
                  return toast.error(
                    'This is the max you can mint in a single transaction'
                  );
                }

                setMintCount(mintCount + 1);
              }}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium bg-white border cursor-pointer rounded-r-md border-slate-300 text-slate-500 hover:bg-slate-50 focus:z-20"
            >
              <span className="sr-only">Add</span>
              <PlusCircleIcon className="w-5 h-5" aria-hidden="true" />
            </a>
            <div className="flex items-center w-full pl-4">
              <Button
                className="flex items-center w-20 h-10"
                // @ts-expect-error
                onClick={async (e: any) => {
                  e.preventDefault();

                  await mintNft(mintCount);
                }}
                variant="primary"
              >
                Mint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const EXCHANGE_IDS = {
  EcosystemMaxi: {
    openSea: 'x7-ecosystem-maxi',
  },
  LiquidityMaxi: {
    openSea: 'x7-liquidity-maxi',
  },
  DexMaxi: {
    openSea: 'x7-dex-maxi',
  },
  BorrowingMaxi: {
    openSea: 'x7-borrowing-maxi',
  },
  Magister: {
    openSea: 'x7-magister',
  },
};

const utilityNftData = [
  {
    name: 'Liquidity MAXI',
    price: '0.5',
    maxMint: 4,
    slug: 'liquidity-maxi',
    contract: ContractsEnum.LiquidityMaxi,
    objective: 'Arbitrage optimizer',
    description:
      'Liquidity Maxi NFTs are designed to provide added insurance to larger price movements. Ownership is for those who aim to preserve as much capital as possible while trading.',
    benefits: [
      '50% fee discount on X7100',
      '25% fee discount on X7R',
      '15% fee discount on X7DAO',
    ],
    denomination: {
      [ChainEnum.erc]: `ETH`,
      [ChainEnum.bsc]: `BNB`,
      [ChainEnum.optimism]: `ETH`,
      [ChainEnum.polygon]: `MATIC`,
      [ChainEnum.arbitrum]: `ETH`,
    },
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.LiquidityMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },
  {
    name: 'Ecosystem MAXI',
    price: '0.1 ETH',
    maxMint: 5,
    slug: 'ecosystem-maxi',
    contract: ContractsEnum.EcosystemMaxi,
    objective: 'Lower fees on trades',
    description:
      'Ecosystem Maxi NFTs are for your everyday X7 maximalist. Ownership will provide traders with added flexibility during their trading experience between trading pairs.',
    benefits: [
      '25% fee discount on X7100',
      '10% fee discount on X7DAO and X7R',
    ],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.EcosystemMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },

  {
    name: 'Borrowing MAXI',
    price: '1 ETH',
    maxMint: 2,
    slug: 'borrowing-maxi',
    contract: ContractsEnum.BorrowingMaxi,
    objective: 'Borrow at lower costs',
    description:
      'Borrowing Maxi NFTs will provide borrowers within our ILO Dex platform a significant advantage in their loan terms. Owning this NFT will reduce overall risk for lenders and borrowers while simultaneously allowing easier liquidity acquisition for DeFi entrepreneurs.',
    benefits: [
      '10% loan origination fee reduction',
      '20% loan premium discount',
    ],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.BorrowingMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },
  {
    name: 'DEX MAXI',
    price: '0.5 ETH',
    slug: 'dex-maxi',
    maxMint: 3,
    contract: ContractsEnum.DexMaxi,
    objective: 'Lower costs on Xchange',
    description:
      'Dex Maxi NFTs provide users of our Dex an additional layer of flexibility during trading. Dex users will find this NFT useful towards a more frictionless trading experience.',
    benefits: ['50% discount on DEX LP fee'],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.DexMaxi.openSea}`,
      [ChainEnum.bsc]: ``,
      [ChainEnum.optimism]: ``,
      [ChainEnum.polygon]: ``,
      [ChainEnum.arbitrum]: ``,
    },
  },
  {
    name: 'MAGISTER',
    slug: 'magister',
    price: '50 ETH',
    maxMint: 1,
    contract: ContractsEnum.Magister,
    objective: 'Veto power in DAO votes',
    description: `MAGISTER NFTs are designed to give investors responsible access to higher DAO voting privileges. Providing this ensures a proper array of checks and balances to the ecosystem. The MAGISTER NFTs also provide owners with the similar high tier benefits of Ecosystem, Liquidity, Dex and Borrower Maxi NFTs.`,
    benefits: [
      'Majority MAGISTER vote overrides 50-75% DAO vote',
      '50% discount on DEX LP fee',
      '20% loan origination fee reduction',
    ],
    exchanges: {
      [ChainEnum.erc]: `https://opensea.io/collection/${EXCHANGE_IDS.Magister.openSea}`,
    },
  },
];
