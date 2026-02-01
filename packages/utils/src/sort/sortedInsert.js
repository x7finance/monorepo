import invariant from "tiny-invariant";
export function sortedInsert(items, add, maxSize, comparator) {
    invariant(maxSize > 0, "MAX_SIZE_ZERO");
    invariant(items.length <= maxSize, "ITEMS_SIZE");
    // Short circuit first item add
    if (items.length === 0) {
        items.push(add);
        return null;
    }
    const isFull = items.length === maxSize;
    const lastItem = items[items.length - 1];
    if (isFull && lastItem !== undefined && comparator(lastItem, add) <= 0) {
        return add;
    }
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        const midItem = items[mid];
        if (midItem !== undefined && comparator(midItem, add) <= 0) {
            lo = mid + 1;
        }
        else {
            hi = mid;
        }
    }
    items.splice(lo, 0, add);
    // Safely handle the return of pop()
    if (isFull) {
        const poppedItem = items.pop();
        return poppedItem ?? null;
    }
    return null;
}
//# sourceMappingURL=sortedInsert.js.map