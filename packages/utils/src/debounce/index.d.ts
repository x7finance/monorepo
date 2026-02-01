interface DebounceOptions {
    before?: boolean;
}
type AnyFunction = (...args: any[]) => any;
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
export declare function pDebounce<T extends AnyFunction>(fn: T, wait: number, options?: DebounceOptions): (...args: Parameters<T>) => Promise<ReturnType<T>>;
export declare namespace pDebounce {
    var promise: <T extends AnyFunction>(fn: T) => (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
}
//# sourceMappingURL=index.d.ts.map