interface BaseNotification {
    id?: number;
    account: string | undefined;
    type: NotificationType;
    chainId: number;
    groupTimestamp: number;
    timestamp: number;
    href?: string;
    txHash?: string;
    fullSummary?: {
        pending: string;
        completed: string;
        failed: string;
    };
    status?: string;
}
export interface PromiseNotification extends BaseNotification {
    promise: Promise<unknown>;
    summary: {
        pending: string;
        completed: string;
        failed: string;
        info?: string;
    };
}
export type NotificationType = "send" | "swap" | "mint" | "burn" | "approval" | "liquidate" | "getLoan" | "removeLiquidity" | "payLiability" | "redeem" | "claim" | "deployToken" | "unlock" | "addToken" | "revoke" | "addLiquidity" | "createPair" | "updateToken";
export type ResolvedNotification = BaseNotification & {
    summary: string;
};
export type NotificationData = PromiseNotification | ResolvedNotification;
export declare const isPromise: (data: PromiseNotification | ResolvedNotification) => data is PromiseNotification;
export {};
//# sourceMappingURL=types.d.ts.map