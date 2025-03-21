/**
 * Formats a date value to a string with the given format.
 */

export function formatDateTime(
  input: string | number,
  includeTime = false,
): string {
  const date = new Date(typeof input === "number" ? input * 1000 : input);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  };

  if (includeTime) {
    options.hour = "numeric";
    options.minute = "numeric";
    options.second = "numeric";
  }

  return date.toLocaleString("en-US", options);
}
