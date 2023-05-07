export async function getPriceQuote({ chain, token }: any) {
  try {
    return await fetch(
      `https://deep-index.moralis.io/api/v2/erc20/${token}/price?chain=${chain}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.NEXT_PUBLIC_MORALIS_API_KEY}`,
        },
        method: 'GET',
      }
    ).then((res) => res.json());
  } catch (error) {
    console.error(error);
  }
}
