import { useCallback } from "react";
import { db } from "../db";
export const useClearNotifications = ({ account, }) => {
    return useCallback(async () => {
        if (!account)
            return;
        return db.notifications.where("account").equals(account).delete();
    }, [account]);
};
//# sourceMappingURL=useClearNotifications.js.map