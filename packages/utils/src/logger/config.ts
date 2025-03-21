import pino from "pino";

export const loggerConfig: pino.LoggerOptions = {
  level: "info",
  browser: {
    asObject: true,
    serialize: true,
    formatters: {
      level(label) {
        return { level: label };
      },
      log(object) {
        // Extract the fields you want to prioritize
        const { service, logCode, message, level, time, ...rest } = object;

        // Reconstruct the log object with properties in the desired order
        const logObject = {
          service,
          logCode,
          message,
          level,
          time,
          ...rest,
        };

        return logObject;
      },
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: "message",
  serializers: {
    err: pino.stdSerializers.err,
  },
};
