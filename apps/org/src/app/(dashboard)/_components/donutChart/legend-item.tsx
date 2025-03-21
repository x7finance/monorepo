/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useContext } from "react";

import { LinkExternal } from "@x7/ui/link";

import { ExplorerDataType, getExplorerLink } from "~/lib/utils/getExplorerLink";
import type { ItemWithRenderProps } from "./donut-chart";
import { DonutChartContext } from "./donut-chart";

export interface Props {
  item: ItemWithRenderProps;
}

export const LegendItem: React.FC<Props> = ({ item }) => {
  const { graphWidth, width } = useContext(DonutChartContext);
  const { clickHandlers, label, chain, value, ...restItemRenderProps } = item;

  const legendWidth = width - graphWidth;
  const sqUnit = legendWidth / 5;

  const contractAddress = getExplorerLink(
    chain,
    item.address?.result!,
    ExplorerDataType.ADDRESS,
  );

  return (
    <tr {...clickHandlers}>
      <td className="max-w-[200px] py-2 pr-3 pl-6 text-sm font-medium whitespace-nowrap text-zinc-900 sm:pl-1 dark:text-zinc-100">
        <span className="flex items-center">
          <svg height={20} width={20}>
            <g>
              <rect {...restItemRenderProps} height={sqUnit} width={sqUnit} />
            </g>
          </svg>
          <span className="ml-2">{`${label}`}</span>
        </span>
        <LinkExternal
          rel="noopener noreferrer"
          target="_blank"
          href={contractAddress}
          className="text-xs text-zinc-400 underline hover:text-violet-600 dark:text-zinc-600"
        >
          <span className="hidden overflow-hidden md:block">
            {contractAddress}
          </span>
          <span className="block md:hidden">Wallet Address</span>
        </LinkExternal>
      </td>

      <td className="flex justify-end px-3 py-2 text-sm whitespace-nowrap text-zinc-500 dark:text-zinc-400">
        {value}%
      </td>
    </tr>
  );
};
