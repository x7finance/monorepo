export function formatAddress(address) {
    const leadingChars = 5;
    const trailingChars = 5;
    return address.length < leadingChars + trailingChars
        ? address
        : `${address.substring(0, leadingChars)}\u2026${address.substring(address.length - trailingChars)}`;
}
//# sourceMappingURL=formatAddress.js.map