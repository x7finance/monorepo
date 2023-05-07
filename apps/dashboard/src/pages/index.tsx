import dynamic from 'next/dynamic';

import { Heading } from '../components/heading';
import { SplittersOverview } from '../components/splittersOverview';

const PairsTable = dynamic(
  () => import('../components/pairsTable').then((mod) => mod.PairsTable),
  {
    ssr: false,
  }
);

export default function LiveDashboardPage() {
  return (
    <>
      <div className="my-16 xl:max-w-none">
        <Heading
          className="mt-12 mb-10 text-xl font-semibold border-b not-prose border-zinc-900/5 text-slate-900 dark:border-white/5 dark:text-slate-100"
          level={1}
          id="pairs"
          subHeader="The latest pairs created on Xchange"
        >
          Live Pairs
        </Heading>
        <PairsTable />
      </div>
      <div className="mt-32 mb-16 xl:max-w-none">
        <Heading
          className="mt-24 mb-10 text-xl font-semibold border-b not-prose border-zinc-900/5 text-slate-900 dark:border-white/5 dark:text-slate-100"
          level={2}
          id="splits"
          subHeader="A detailed breakdown of where liquidity and funds are being moved through the ecosystem"
        >
          Live Ecosystem Splits
        </Heading>
        <div className="grid grid-cols-1 gap-8 mt-4 not-prose xl:grid-cols-2">
          <SplittersOverview />
        </div>
      </div>
    </>
  );
}
