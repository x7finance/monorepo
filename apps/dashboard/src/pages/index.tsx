import dynamic from 'next/dynamic';

import { Heading } from '../components/heading';
import { SplittersOverview } from '../components/splittersOverview';
import { useState } from 'react';

const PairsTable = dynamic(
  () => import('../components/pairsTable').then((mod) => mod.PairsTable),
  {
    ssr: false,
  }
);

export default function LiveDashboardPage() {
  const [activeTab, setActiveTab] = useState('ethereum');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  return (
    <>
      <div className="my-16 xl:max-w-none">
        <Heading
          className="not-prose mb-10 mt-12 border-b border-zinc-900/5 text-xl font-semibold text-slate-900 dark:border-white/5 dark:text-slate-100"
          level={1}
          id="pairs"
          subHeader="The latest pairs created on Xchange"
        >
          Live Pairs
        </Heading>
        <div className="mb-8 flex justify-center space-x-4">
          <button
            className={`text-lg font-medium ${
              activeTab === 'ethereum' ? 'text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('ethereum')}
          >
            Ethereum
          </button>
          <button
            className={`text-lg font-medium ${
              activeTab === 'binance' ? 'text-yellow-600' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('binance')}
          >
            Binance
          </button>
          <button
            className={`text-lg font-medium ${
              activeTab === 'polygon' ? 'text-purple-600' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('polygon')}
          >
            Polygon
          </button>
          <button
            className={`text-lg font-medium ${
              activeTab === 'arbitrum' ? 'text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('arbitrum')}
          >
            Arbitrum
          </button>
          <button
            className={`text-lg font-medium ${
              activeTab === 'optimism' ? 'text-red-600' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('optimism')}
          >
            Optimism
          </button>
        </div>

        {activeTab === 'ethereum' && <PairsTable chainId={1} />}
        {activeTab === 'binance' && <PairsTable chainId={56} />}
        {activeTab === 'polygon' && <PairsTable chainId={137} />}
        {activeTab === 'arbitrum' && <PairsTable chainId={42161} />}
        {activeTab === 'optimism' && <PairsTable chainId={10} />}
      </div>
      <div className="mb-16 mt-32 xl:max-w-none">
        <Heading
          className="not-prose mb-10 mt-24 border-b border-zinc-900/5 text-xl font-semibold text-slate-900 dark:border-white/5 dark:text-slate-100"
          level={2}
          id="splits"
          subHeader="A detailed breakdown of where liquidity and funds are being moved through the ecosystem"
        >
          Live Ecosystem Splits
        </Heading>
        <div className="not-prose mt-4 grid grid-cols-1 gap-8 xl:grid-cols-2">
          <SplittersOverview />
        </div>
      </div>
    </>
  );
}
