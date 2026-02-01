/**
 * Returns the biggest member of the array
 * @param values the values from which the biggest gets returned
 * @returns the biggest member of the array, or null if the array is empty
 */
export function maximum(...values: bigint[]): bigint | null {
  if (values.length === 0) {
    return null
  }

  let highest = values[0]
  if (highest === undefined) {
    throw new Error("Unexpected undefined value")
  }

  for (let i = 1; i < values.length; i++) {
    const value = values[i]
    if (value === undefined) {
      throw new Error("Unexpected undefined value")
    }

    if (value > highest) {
      highest = value
    }
  }

  return highest
}
