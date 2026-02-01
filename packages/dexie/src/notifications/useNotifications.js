import { useLiveQuery } from "dexie-react-hooks";
import groupBy from "lodash.groupby";
import { db } from "../db";
export const useNotifications = ({ account, }) => {
    return useLiveQuery(async () => {
        if (!account)
            return [];
        const notifications = await db.notifications
            .where("account")
            .equals(account)
            .sortBy("groupTimestamp");
        const group = groupBy(notifications, "groupTimestamp");
        return Object.entries(group).reduce((acc, cur) => {
            acc[cur[0]] = [...cur[1]].sort((a, b) => b.timestamp - a.timestamp);
            return acc;
        }, {});
    }, [account]);
};
//# sourceMappingURL=useNotifications.js.map