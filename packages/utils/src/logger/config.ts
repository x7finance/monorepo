import pino from "pino"

/**
 * Determines the log level based on environment
 * - development: "debug" for verbose output
 * - production: "info" for minimal output
 * - LOG_LEVEL env var overrides the default
 */
function getLogLevel(): pino.Level {
  // Allow explicit override via environment variable
  const envLevel = process.env.LOG_LEVEL
  if (
    envLevel &&
    ["fatal", "error", "warn", "info", "debug", "trace"].includes(envLevel)
  ) {
    return envLevel as pino.Level
  }

  // Default based on NODE_ENV
  return process.env.NODE_ENV === "production" ? "info" : "debug"
}

export const loggerConfig: pino.LoggerOptions = {
  level: getLogLevel(),
  browser: {
    asObject: true,
    serialize: true,
    formatters: {
      level(label) {
        return { level: label }
      },
      log(object) {
        // Extract the fields you want to prioritize
        const { service, logCode, message, level, time, ...rest } = object

        // Reconstruct the log object with properties in the desired order
        const logObject = {
          service,
          logCode,
          message,
          level,
          time,
          ...rest,
        }

        return logObject
      },
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: "message",
  serializers: {
    err: pino.stdSerializers.err,
  },
}
