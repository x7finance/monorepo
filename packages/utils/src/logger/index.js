/* oxlint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from "./create";
export function getLogger(options) {
    const pinoLogger = createLogger(options);
    const loggerWithService = pinoLogger.child({ service: options.serviceName });
    const logger = createWrappedLogger(loggerWithService);
    return logger;
}
function createWrappedLogger(pinoLoggerInstance) {
    const logMethod = (method) => {
        return (logCode, msgOrObj, ..._args) => {
            try {
                if (method === "error") {
                    pinoLoggerInstance.warn(msgOrObj);
                }
                else
                    pinoLoggerInstance[method](msgOrObj);
            }
            catch (e) {
                console.log("LOGGER FAILED:", {
                    error: e,
                    method,
                    logCode,
                    msgOrObj: JSON.stringify(msgOrObj),
                    hasLogger: !!pinoLoggerInstance,
                    hasMethod: !!pinoLoggerInstance[method],
                });
            }
        };
    };
    const wrappedLogger = {
        fatal: logMethod("fatal"),
        error: logMethod("error"),
        warn: logMethod("warn"),
        info: logMethod("info"),
        debug: logMethod("debug"),
        trace: logMethod("trace"),
        child: (bindings) => {
            return createWrappedLogger(pinoLoggerInstance.child(bindings));
        },
    };
    return wrappedLogger;
}
export { LogCodes } from "./codes";
//# sourceMappingURL=index.js.map