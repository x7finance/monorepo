export { VersionUpgrade };
var VersionUpgrade;
(function (VersionUpgrade) {
    VersionUpgrade[VersionUpgrade["NONE"] = 0] = "NONE";
    VersionUpgrade[VersionUpgrade["PATCH"] = 1] = "PATCH";
    VersionUpgrade[VersionUpgrade["MINOR"] = 2] = "MINOR";
    VersionUpgrade[VersionUpgrade["MAJOR"] = 3] = "MAJOR";
})(VersionUpgrade || (VersionUpgrade = {}));
/**
 * Return the upgrade type from the base version to the update version.
 * Note that downgrades and equivalent versions are both treated as `NONE`.
 * @param base base list
 * @param update update to the list
 */
export function getVersionUpgrade(base, update) {
    if (update.major > base.major) {
        return VersionUpgrade.MAJOR;
    }
    if (update.major < base.major) {
        return VersionUpgrade.NONE;
    }
    if (update.minor > base.minor) {
        return VersionUpgrade.MINOR;
    }
    if (update.minor < base.minor) {
        return VersionUpgrade.NONE;
    }
    return update.patch > base.patch ? VersionUpgrade.PATCH : VersionUpgrade.NONE;
}
//# sourceMappingURL=getVersionUpgrade.js.map