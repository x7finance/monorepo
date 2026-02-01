import type { LogCodes } from "../logger/codes";
export interface LogMethod {
    (logCode: LogCodes, msg: string, ...args: any[]): void;
    (logCode: LogCodes, obj: object, msg?: string, ...args: any[]): void;
    (logCode: LogCodes, msgOrObj: any, ...args: any[]): void;
}
export interface ErrorLogMethod {
    (errorCode: LogCodes, msg: string, ...args: any[]): void;
    (errorCode: LogCodes, obj: object, msg?: string, ...args: any[]): void;
}
export interface Logger {
    fatal: ErrorLogMethod;
    error: ErrorLogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    trace: LogMethod;
    child(bindings: object): Logger;
}
//# sourceMappingURL=logger.d.ts.map