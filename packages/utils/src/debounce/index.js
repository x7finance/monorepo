/* oxlint-enable @typescript-eslint/no-explicit-any */
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
export function pDebounce(fn, wait, options = { before: false }) {
    if (!Number.isFinite(wait)) {
        throw new TypeError("Expected `wait` to be a finite number");
    }
    let leadingValue;
    let timeout;
    let resolveList = [];
    return function (...args) {
        return new Promise((resolve) => {
            const shouldCallNow = options.before && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = undefined;
                const result = options.before
                    ? leadingValue
                    : fn.apply(this, args);
                for (const resolveFunc of resolveList) {
                    resolveFunc(result);
                }
                resolveList = [];
            }, wait);
            if (shouldCallNow) {
                leadingValue = fn.apply(this, args);
                resolve(leadingValue);
            }
            else {
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
pDebounce.promise = function (fn) {
    let currentPromise;
    return async function (...args) {
        if (currentPromise) {
            return currentPromise;
        }
        try {
            currentPromise = fn.apply(this, args);
            return await currentPromise;
        }
        finally {
            currentPromise = undefined;
        }
    };
};
//# sourceMappingURL=index.js.map