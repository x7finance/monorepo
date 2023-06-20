export function formatDollar(amt: number): string {
  return amt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
}

export function numberWithCommas(x: number | string): string {
  const value = typeof x === "number" ? x.toString() : x
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatTotalRealized(
  totalEarnings: number | string,
  totalUnpaid: number | string
): string {
  const earnings =
    typeof totalEarnings === "number"
      ? totalEarnings
      : parseFloat(totalEarnings?.replace(/,/g, "") ?? "0")
  const unpaid =
    typeof totalUnpaid === "number"
      ? totalUnpaid
      : parseFloat(totalUnpaid?.replace(/,/g, "") ?? "0")

  const formattedTotal = (
    Number(earnings.toFixed(2)) - Number(unpaid.toFixed(2))
  ).toFixed(2)

  return numberWithCommas(formattedTotal)
}

type LookupItem = {
  value: number
  symbol: string
}

const lookup: LookupItem[] = [
  { value: 1e18, symbol: "E" },
  { value: 1e15, symbol: "P" },
  { value: 1e12, symbol: "T" },
  { value: 1e9, symbol: "B" },
  { value: 1e6, symbol: "M" },
  { value: 1e3, symbol: "K" },
]

export function abbreviateNumber(val: string | number, digits: number): string {
  const value = val ?? "0.0"
  const num = parseFloat(value.toString().split(",").join(""))

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0"
}
