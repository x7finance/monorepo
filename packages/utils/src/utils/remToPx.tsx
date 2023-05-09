export function remToPx(remValue: any) {
  let rootFontSize =
    typeof window === 'undefined'
      ? 16
      : parseFloat(window.getComputedStyle(document.documentElement).fontSize);

  return parseFloat(remValue) * rootFontSize;
}
