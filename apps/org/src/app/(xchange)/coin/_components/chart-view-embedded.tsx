import React from "react";

export function PriceChartEmbed({
  chainId,
  contractAddress,
}: {
  chainId: number;
  contractAddress: `0x${string}`;
}) {
  const chain = getChain(chainId);
  return (
    <div className="h-[800px] w-full overflow-hidden rounded-lg bg-gray-800">
      <iframe
        height="100%"
        width="100%"
        id="geckoterminal-embed"
        title="GeckoTerminal Embed"
        src={`https://www.geckoterminal.com/${chain}/pools/${contractAddress}?embed=1&info=0&swaps=1&grayscale=0&light_chart=0`}
        allow="clipboard-write"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
function getChain(chainId: number) {
  if (chainId === 8453) {
    return "base";
  }
  return "eth";
}
