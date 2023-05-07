export function formatDollar(amt: any) {
  return amt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export function numberWithCommas(x: number | string) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatTotalRealized(
  totalEarnings: string,
  totalUnpaid: string
) {
  return numberWithCommas(
    (
      Number(parseFloat(totalEarnings?.replace(/,/g, '')).toFixed(2)) -
      Number(parseFloat(totalUnpaid?.replace(/,/g, '')).toFixed(2))
    ).toFixed(2)
  );
}

const lookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'B' },
  { value: 1e12, symbol: 'T' },
];

export function abbreviateNumber(val: string | number, digits: number) {
  const value = val ?? 0.0;
  // @ts-ignore
  const num = parseFloat(value?.toString()?.replaceAll(',', ''));
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
}
