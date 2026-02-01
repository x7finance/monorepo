/**
 * Format a number as currency (USD)
 * Returns "--" for invalid/zero values
 */
export function formatCurrency(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    placeholder?: string;
  },
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2, placeholder = "--" } = options ?? {};

  if (!value || Number.isNaN(value) || value === 0) return placeholder;

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

/**
 * Format a number with locale-specific formatting
 * Returns "--" for invalid/zero values
 */
export function formatNumber(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    placeholder?: string;
  },
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2, placeholder = "--" } = options ?? {};

  if (!value || Number.isNaN(value) || value === 0) return placeholder;

  return value.toLocaleString("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

/**
 * Format a number as percentage
 * Returns "--" for invalid values
 */
export function formatPercentage(
  value: string | number,
  options?: {
    fractionDigits?: number;
    placeholder?: string;
  },
): string {
  const { fractionDigits = 2, placeholder = "--" } = options ?? {};

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (!numValue || Number.isNaN(numValue)) return placeholder;

  return `${numValue.toFixed(fractionDigits)}%`;
}
