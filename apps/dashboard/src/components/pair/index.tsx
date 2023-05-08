import { BlockchainType } from 'common';
import { useXchangeTokenData } from 'hooks';
import { IconWrapper, ClipboardDocumentIcon } from 'icons';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useClipboard } from 'use-clipboard-copy';
import {
  cn,
  generateChainBase,
  generateChainDenomination,
  generateChainIdentifier,
} from 'utils';
import { useNetwork } from 'wagmi';

interface PairsProps {
  id: number;
}

export function Pair({ id }: PairsProps) {
  const { chain } = useNetwork();

  const { tokenName, tokenSymbol, tokenContract, tokenReserve, tokenPrice } =
    useXchangeTokenData(id);

  const clipboard = useClipboard({
    onSuccess() {
      toast.success(<span>Contract Copied</span>, {
        duration: 3000,
        style: {
          border: `none`,
          background: '#000',
          color: 'white',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#000',
        },
      });
    },
  });

  return (
    <tr key={id}>
      <td
        className={cn(
          id === 0 ? '' : 'border-t border-transparent',
          'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
        )}
      >
        <div className="font-medium text-slate-900 dark:text-slate-100">
          <>
            {tokenSymbol ? tokenSymbol : 'Awaiting Liquidity...'}
            <div className="relative top-1 ml-2 inline-block lg:hidden">
              <div className="flex items-center space-x-2">
                <div className="flex flex-shrink-0 space-x-1">
                  <Link
                    href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                      chain?.id as BlockchainType
                    )}/pair-explorer/${tokenContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${tokenContract}-${id}-chart`}
                    className="opacity-80 hover:opacity-100"
                  >
                    <IconWrapper glyph={IconWrapper.glyph.dextools} size={5} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        </div>
        <div className="mt-1 flex flex-col text-sm text-slate-500 dark:text-slate-400 sm:block lg:hidden">
          <span
            onClick={() => {
              clipboard.copy(tokenContract);
            }}
            className="flex cursor-pointer items-center opacity-70 hover:underline dark:opacity-50"
          >
            Contract
            <span className="ml-0.5">
              <ClipboardDocumentIcon
                className="inline-block h-4 w-4 "
                aria-hidden="true"
              />
              <span className="sr-only">Copy Contract</span>
            </span>
          </span>
        </div>
        {id !== 0 ? (
          <div className="absolute right-0 left-6 -top-px h-px bg-zinc-900/7.5 dark:bg-white/10" />
        ) : null}
      </td>

      <td
        className={cn(
          id === 0 ? '' : 'border-t border-zinc-900/7.5 dark:border-white/10',
          'hidden px-3 py-3.5 text-xs text-slate-500 dark:text-slate-400 lg:table-cell'
        )}
      >
        <span>{tokenName}</span>
        <span
          onClick={() => {
            clipboard.copy(tokenContract);
          }}
          className="flex cursor-pointer items-center opacity-70 hover:underline dark:opacity-50"
        >
          <>
            {tokenContract}
            <span className="ml-0.5">
              <ClipboardDocumentIcon
                className="inline-block h-4 w-4 "
                aria-hidden="true"
              />
              <span className="sr-only">Copy Contract</span>
            </span>
          </>
        </span>
      </td>
      <td
        className={cn(
          id === 0 ? '' : 'border-t border-zinc-900/7.5 dark:border-white/10',
          'relative py-4 pl-1 pr-3 text-sm sm:pl-1'
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <span className="pl-1">$</span>
            {tokenReserve ? tokenPrice : '$ 0.00'}
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? '' : 'border-t border-zinc-900/7.5 dark:border-white/10',
          'hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 lg:table-cell'
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            {tokenReserve ? tokenReserve : 'Awaiting Liquidity...'}
            <span className="pl-1">
              {generateChainDenomination(chain?.id as BlockchainType)}
            </span>
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? '' : 'border-t border-zinc-900/7.5 dark:border-white/10',
          'hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 lg:table-cell'
        )}
      >
        <div className="flex items-center space-x-2">
          <div className="flex flex-shrink-0 space-x-1">
            <Link
              href={`https://www.dextools.io/app/en/${generateChainIdentifier(
                chain?.id as BlockchainType
              )}/pair-explorer/${tokenContract}`}
              target="_blank"
              rel="noopener noreferrer"
              key={`${tokenContract}-${id}-chart`}
              className="flex h-full w-full items-center justify-center opacity-80 hover:opacity-100"
            >
              <IconWrapper glyph={IconWrapper.glyph.dextools} size={5} />
            </Link>
          </div>
        </div>
      </td>
      <td
        className={cn(
          id === 0 ? '' : 'border-t border-zinc-900/7.5 dark:border-white/10',
          'hidden px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400 lg:table-cell'
        )}
      >
        <Link
          href={`${generateChainBase(chain?.id ?? 0)}/address/${tokenContract}`}
          target="_blank"
          rel="noopener noreferrer"
          key={`${tokenContract}-${id}-chart`}
          className="opacity-80 hover:opacity-100"
        >
          <span>Scanner</span>
        </Link>
      </td>
      <td
        className={cn(
          id === 0 ? '' : 'border-t border-transparent',
          'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'
        )}
      >
        <div className="flex w-full justify-center">
          <Link
            href={`https://app.x7.finance/#/swap?outputCurrency=${tokenContract}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${tokenContract}-${id}-chart`}
            className="inline-flex justify-center gap-0.5 overflow-hidden rounded-full bg-sky-400/20 py-1 px-3 text-sm font-medium text-sky-600 ring-1 ring-inset ring-sky-400/80 transition hover:bg-sky-400/70 hover:text-white hover:ring-sky-700 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20 dark:hover:bg-sky-400/10 dark:hover:text-sky-300 dark:hover:ring-sky-300"
          >
            <span className="whitespace-nowrap">
              <span>Trade</span>
              <span className="hidden xl:ml-2 xl:inline-block">on Xchange</span>
            </span>
          </Link>
        </div>
        {id !== 0 ? (
          <div className="absolute left-0 right-6 -top-px h-px bg-zinc-900/7.5 dark:bg-white/10" />
        ) : null}
      </td>
    </tr>
  );
}
