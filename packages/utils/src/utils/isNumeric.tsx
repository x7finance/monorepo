export function isNumeric(str: string) {
  if (typeof str != 'string') {
    return false;
  }
  // @ts-expect-error
  return !isNaN(str) && !isNaN(parseFloat(str));
}
