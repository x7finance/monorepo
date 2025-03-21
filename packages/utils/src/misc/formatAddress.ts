export function formatAddress(address: string): string {
  const leadingChars = 5;
  const trailingChars = 5;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars,
      )}`;
}
