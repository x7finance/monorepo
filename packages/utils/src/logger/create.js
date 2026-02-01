// src/createLogger.browser.ts
import pino from "pino";
import { loggerConfig } from "./config";
export function createLogger(options) {
    const { serviceName } = options;
    const logger = pino({
        ...loggerConfig,
        base: { service: serviceName },
    });
    return logger;
}
//# sourceMappingURL=create.js.map