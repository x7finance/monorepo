import { ConnectKitButton } from 'connectkit';
import { shortenHex, cn } from 'utils';
import { useNetwork } from 'wagmi';

import { ChainSelect } from '../chainSelect';

export function ConnectionComponent(props: { id: 'mobile' | 'desktop' }) {
  const { chain } = useNetwork();

  return (
    <div className="relative mt-1 flex items-center">
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          return isConnected ? (
            <>
              <button
                type="button"
                onClick={show}
                className="ml-1 inline-flex h-6 items-center whitespace-nowrap rounded-full bg-white px-1 text-xs font-bold shadow-md shadow-black/5 ring-1 ring-black/5 hover:bg-opacity-60 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-sky-400 dark:ring-inset dark:ring-white/5 hover:dark:bg-slate-600 sm:ml-0 sm:px-4 sm:text-sm"
              >
                {ensName ?? `${shortenHex(address ?? ``, 4)}`}
              </button>
            </>
          ) : (
            <button
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gray-800 px-3 py-1 text-sm font-bold tracking-tighter text-white"
              onClick={show}
            >
              <span className="absolute h-0 w-0 rounded-full bg-indigo-500 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56" />
              <span className="absolute inset-0 -mt-1 h-full w-full rounded-lg bg-gradient-to-b from-transparent via-transparent to-gray-700 opacity-30" />
              <span className="relative whitespace-nowrap">
                {isConnecting ? 'Connecting...' : `Connect Wallet`}
              </span>
              <span className="sr-only">Connect Wallet</span>
            </button>
          );
        }}
      </ConnectKitButton.Custom>

      <div className={cn(!!chain?.id ? `` : `hidden`, `ml-1 sm:ml-4`)}>
        <ChainSelect chainId={chain?.id} />
      </div>
    </div>
  );
}
