import { Listbox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useModal } from 'connectkit';

import { renderConnectedChain } from '../../lib/utils/chainFormatters';

interface ChainSelectProps {
  chainId?: number;
}

export function ChainSelect(props: ChainSelectProps) {
  const { chainId } = props;
  const { openSwitchNetworks } = useModal();

  return (
    <Listbox value={chainId}>
      <div className="relative">
        <Listbox.Button
          onClick={() => {
            openSwitchNetworks();
          }}
          className="relative h-8 w-10 cursor-pointer rounded-lg bg-white bg-opacity-40 pl-3 pr-10 text-left shadow-md shadow-black/5 ring-1 ring-black/5 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 dark:bg-slate-700 dark:ring-inset dark:ring-white/5 hover:dark:bg-slate-600 sm:text-sm"
        >
          <span className="relative -left-[4px] top-1">
            {renderConnectedChain(chainId)}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-4 w-4 text-gray-600 dark:text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
      </div>
    </Listbox>
  );
}
