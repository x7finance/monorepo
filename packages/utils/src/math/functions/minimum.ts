function minimum(...values: number[]): number;
function minimum(...values: bigint[]): bigint;

/**
 * Returns the smallest member of the array
 * @param values the values from which the smallest gets returned
 * @returns the smallest member of the array
 */
function minimum(...values: (number | bigint)[]): number | bigint {
  if (values.length === 0) {
    throw new Error("No arguments provided to minimum function");
  }

  let lowest = values[0];
  if (lowest === undefined) {
    throw new Error("Unexpected undefined value");
  }

  for (let i = 1; i < values.length; i++) {
    const value = values[i];
    if (value === undefined) {
      throw new Error("Unexpected undefined value");
    }

    if (value < lowest) {
      lowest = value;
    }
  }

  return lowest;
}

export { minimum };
