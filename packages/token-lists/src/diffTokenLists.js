/**
 * compares two token info key values
 * this subset of full deep equal functionality does not work on objects or object arrays
 * @param a comparison item a
 * @param b comparison item b
 */
function compareTokenInfoProperty(a, b) {
    if (a === b)
        return true;
    if (typeof a !== typeof b)
        return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.every((el, i) => b[i] === el);
    }
    return false;
}
/**
 * Computes the diff of a token list where the first argument is the base and the second argument is the updated list.
 * @param base base list
 * @param update updated list
 */
export function diffTokenLists(base, update) {
    const indexedBase = base.reduce((memo, tokenInfo) => {
        if (!memo[tokenInfo.chainId])
            memo[tokenInfo.chainId] = {};
        memo[tokenInfo.chainId][tokenInfo.address] = tokenInfo;
        return memo;
    }, {});
    const newListUpdates = update.reduce((memo, tokenInfo) => {
        const baseToken = indexedBase[tokenInfo.chainId]?.[tokenInfo.address];
        if (!baseToken) {
            // oxlint-disable-next-line @typescript-eslint/no-unsafe-call
            memo.added.push(tokenInfo);
        }
        else {
            const changes = Object.keys(tokenInfo)
                .filter((s) => s !== "address" && s !== "chainId")
                .filter((s) => {
                return !compareTokenInfoProperty(tokenInfo[s], baseToken[s]);
            });
            if (changes.length > 0) {
                if (!memo.changed[tokenInfo.chainId]) {
                    memo.changed[tokenInfo.chainId] = {};
                }
                memo.changed[tokenInfo.chainId][tokenInfo.address] = changes;
            }
        }
        if (!memo.index[tokenInfo.chainId]) {
            memo.index[tokenInfo.chainId] = {
                [tokenInfo.address]: true,
            };
        }
        else {
            memo.index[tokenInfo.chainId][tokenInfo.address] = true;
        }
        return memo;
    }, { added: [], changed: {}, index: {} });
    const removed = base.reduce((list, curr) => {
        if (!newListUpdates.index[curr.chainId]?.[curr.address]) {
            list.push(curr);
        }
        return list;
    }, []);
    return {
        added: newListUpdates.added,
        changed: newListUpdates.changed,
        removed,
    };
}
//# sourceMappingURL=diffTokenLists.js.map