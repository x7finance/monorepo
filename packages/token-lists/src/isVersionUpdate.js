import { versionComparator } from "./versionComparator";
/**
 * Returns true if versionB is an update over versionA
 */
export function isVersionUpdate(base, update) {
    return versionComparator(base, update) < 0;
}
//# sourceMappingURL=isVersionUpdate.js.map