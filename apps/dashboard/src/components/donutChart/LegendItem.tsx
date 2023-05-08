import React, { useContext } from 'react';
import { generateChainBase } from 'utils';
import { useNetwork } from 'wagmi';

import { DonutChartContext, ItemWithRenderProps } from './DonutChart';

export type Props = { item: ItemWithRenderProps };

export const LegendItem: React.FC<Props> = ({ item }) => {
  const { graphWidth, width } = useContext(DonutChartContext);
  const {
    classNames,
    clickHandlers,
    index,
    isEmpty,
    label,
    value,
    ...restItemRenderProps
  } = item;

  const { chain } = useNetwork();
  const legendWidth = width - graphWidth;
  const sqUnit = legendWidth / 5;

  const contractAddress = `${generateChainBase(chain?.id ?? 1)}/address/${
    item?.address
  }`;

  return (
    <tr {...clickHandlers}>
      <td className="max-w-[200px] whitespace-nowrap py-2 pl-6 pr-3 text-sm font-medium text-slate-900 dark:text-slate-100 sm:pl-0">
        <span className="flex items-center">
          <svg height={20} width={20}>
            <g>
              <rect {...restItemRenderProps} height={sqUnit} width={sqUnit} />
            </g>
          </svg>
          <span className="ml-2">{`${label}`}</span>
        </span>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={contractAddress}
          className="text-xs underline text-slate-400 hover:text-sky-600 dark:text-slate-600"
        >
          <span className="hidden overflow-hidden md:block">
            {contractAddress}
          </span>
          <span className="block md:hidden">Wallet Address</span>
        </a>
      </td>

      <td className="flex justify-end px-3 py-2 text-sm whitespace-nowrap text-slate-500 dark:text-slate-400">
        {value}%
      </td>
    </tr>
  );
};
