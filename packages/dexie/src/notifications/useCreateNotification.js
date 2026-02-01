import { useCallback } from "react";
import { createNotification } from "./createNotification";
export const useCreateNotification = () => {
    return useCallback(createNotification, []);
};
//# sourceMappingURL=useCreateNotification.js.map