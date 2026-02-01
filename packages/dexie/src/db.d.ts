import { Dexie } from "dexie";
import type { Table } from "dexie";
import type { ResolvedNotification } from "./notifications/types.js";
import type { SavedToken } from "./tokens/types.js";
export declare class X7Dexie extends Dexie {
    notifications: Table<ResolvedNotification & {
        account: string;
    }>;
    tokens: Table<SavedToken>;
    constructor();
}
export declare const db: X7Dexie;
//# sourceMappingURL=db.d.ts.map