/* oxlint-disable @typescript-eslint/restrict-template-expressions */
import { db } from "../db";
export const getToken = async ({ chainId, address, }) => {
    if (!chainId || typeof address !== "string")
        return;
    try {
        const token = await db.tokens
            .where("id")
            .equals(`${chainId}:${address.toLowerCase()}`)
            .first();
        return token;
    }
    catch (error) {
        console.error(`${error}`);
    }
};
//# sourceMappingURL=getToken.js.map