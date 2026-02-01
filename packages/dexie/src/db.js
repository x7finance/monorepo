import { Dexie } from "dexie";
export class X7Dexie extends Dexie {
    notifications;
    tokens;
    constructor() {
        super("x7");
        this.version(2).stores({
            notifications: "++id, account, chainId, href, txHash, summary, type, timestamp, groupTimestamp, status, fullSummary",
            tokens: "id, address, chainId, decimals, name, symbol, status",
        });
    }
}
export const db = new X7Dexie();
//# sourceMappingURL=db.js.map