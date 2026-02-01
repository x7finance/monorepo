/* oxlint-disable @typescript-eslint/restrict-template-expressions */
import { db } from "../db";
export const saveTokens = async ({ tokens }) => {
    try {
        await db.tokens.bulkPut(tokens);
    }
    catch (error) {
        console.error(`${error}`);
    }
};
//# sourceMappingURL=saveToken.js.map