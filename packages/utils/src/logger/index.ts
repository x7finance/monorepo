/* oxlint-disable @typescript-eslint/no-explicit-any */

import type { Logger as PinoLogger } from "pino";

import type { Logger, LogMethod } from "../types";
import type { LogCodes } from "./codes";
import { createLogger } from "./create";
import type { LoggerOptions } from "./options";

export function getLogger(options: LoggerOptions): Logger {
  const pinoLogger: PinoLogger = createLogger(options);
  const loggerWithService = pinoLogger.child({ service: options.serviceName });

  const logger = createWrappedLogger(loggerWithService);

  return logger;
}

function createWrappedLogger(pinoLoggerInstance: PinoLogger): Logger {
  type LogLevels = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

  const logMethod = (method: LogLevels): LogMethod => {
    return (logCode: LogCodes, msgOrObj: any, ..._args: any[]): void => {
      try {
        if (method === "error") {
          pinoLoggerInstance.warn(msgOrObj);
        } else pinoLoggerInstance[method](msgOrObj);
      } catch (e) {
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

  const wrappedLogger: Logger = {
    fatal: logMethod("fatal"),
    error: logMethod("error"),
    warn: logMethod("warn"),
    info: logMethod("info"),
    debug: logMethod("debug"),
    trace: logMethod("trace"),
    child: (bindings: object): Logger => {
      return createWrappedLogger(pinoLoggerInstance.child(bindings));
    },
  };

  return wrappedLogger;
}

export { LogCodes } from "./codes";
