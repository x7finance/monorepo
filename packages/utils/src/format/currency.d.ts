/**
 * Format a number as currency (USD)
 * Returns "--" for invalid/zero values
 */
export declare function formatCurrency(value: number, options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    placeholder?: string;
}): string;
/**
 * Format a number with locale-specific formatting
 * Returns "--" for invalid/zero values
 */
export declare function formatNumber(value: number, options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    placeholder?: string;
}): string;
/**
 * Format a number as percentage
 * Returns "--" for invalid values
 */
export declare function formatPercentage(value: string | number, options?: {
    fractionDigits?: number;
    placeholder?: string;
}): string;
//# sourceMappingURL=currency.d.ts.map