export function remToPx(remValue: number | string): number {
  const rootFontSize =
    typeof window === "undefined"
      ? 16
      : parseFloat(window.getComputedStyle(document.documentElement).fontSize)

  return parseFloat(remValue.toString()) * rootFontSize
}
