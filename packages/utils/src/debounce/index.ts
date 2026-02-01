interface DebounceOptions {
  before?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFunction = (...args: any[]) => any;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Promise-based debounce utility.
 * Delays invoking the function until after `wait` milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param fn - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Options object with `before` flag to invoke on leading edge
 * @returns A debounced version of the function that returns a Promise
 */
export function pDebounce<T extends AnyFunction>(
  fn: T,
  wait: number,
  options: DebounceOptions = { before: false },
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }

  let leadingValue: ReturnType<T> | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let resolveList: ((value: ReturnType<T>) => void)[] = [];

  return function (this: unknown, ...args: Parameters<T>) {
    return new Promise<ReturnType<T>>((resolve) => {
      const shouldCallNow = options.before && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        timeout = undefined;

        const result = options.before
          ? leadingValue
          : (fn.apply(this, args) as ReturnType<T>);

        for (const resolveFunc of resolveList) {
          resolveFunc(result as ReturnType<T>);
        }

        resolveList = [];
      }, wait);

      if (shouldCallNow) {
        leadingValue = fn.apply(this, args) as ReturnType<T>;
        resolve(leadingValue as ReturnType<T>);
      } else {
        resolveList.push(resolve);
      }
    });
  };
}

/**
 * Wraps a function to ensure only one promise is active at a time.
 * Subsequent calls while a promise is pending will return the same promise.
 *
 * @param fn - The async function to wrap
 * @returns A wrapped function that deduplicates concurrent calls
 */
pDebounce.promise = function <T extends AnyFunction>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let currentPromise: Promise<Awaited<ReturnType<T>>> | undefined;

  return async function (
    this: unknown,
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> {
    if (currentPromise) {
      return currentPromise;
    }

    try {
      currentPromise = fn.apply(this, args) as Promise<Awaited<ReturnType<T>>>;
      return await currentPromise;
    } finally {
      currentPromise = undefined;
    }
  };
};
