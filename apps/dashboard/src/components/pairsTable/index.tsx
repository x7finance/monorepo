import { ContractsEnum } from 'common';
import { AllPairsLength } from 'contracts';
import { useEffect, useState } from 'react';
import { useContractReads, useNetwork } from 'wagmi';
import { generateWagmiChain } from 'utils';

import { Loading } from '../loading';
import { Pair } from '../pair';

export function PairsTable({ chainId }) {
  const [allPairsLength, setAllPairsLength] = useState(0);

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        address: ContractsEnum.XchangeFactory,
        abi: AllPairsLength as any,
        functionName: 'allPairsLength',
        chainId: generateWagmiChain(chainId),
      },
    ],
  });

  const pairsCount = parseInt(data?.[0]?.result?.toString() || '0', 10);
  console.log('pairsCount', pairsCount);

  useEffect(() => {
    setAllPairsLength(pairsCount);
  }, [pairsCount]);

  return (
    <div className="ring-zinc-900/7.5 -mx-4 mt-10 ring-1 dark:ring-white/10 sm:-mx-6 md:mx-0 md:rounded-2xl">
      <table className="divide-zinc-900/7.5 min-w-full divide-y dark:divide-white/10">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 sm:pl-6"
            >
              Token
            </th>

            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 lg:table-cell"
            >
              Pair Contract
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 lg:table-cell"
            >
              Price
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 lg:table-cell"
            >
              Pair Reserves
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 lg:table-cell"
            >
              Chart
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 lg:table-cell"
            >
              Scan
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <LoadingLivePair />
          ) : !!allPairsLength ? (
            Array.from({ length: allPairsLength }, (_, idx) => (
              <Pair key={`${idx}-${chainId}`} id={idx} chainId={chainId} />
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center">
                No pairs created yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function LoadingLivePair() {
  return (
    <tr>
      <td colSpan={4} className="py-4 text-center">
        <Loading size={12} />
      </td>
    </tr>
  );
}
