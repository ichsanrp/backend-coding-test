import path = require("path");
import { createLogger, format, Logger, transports } from "winston";
export let loggers: Logger;
const env = process.env.NODE_ENV || "development";
const logDir = "log";

export function initLogger(file: string) {
    const filename = path.join(logDir, file);

    loggers = createLogger({
        format: format.combine(
            format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            format.json(),
        ),
        level: env === "development" ? "debug" : "info",
        transports: [
        new transports.Console({
            format: format.combine(
            format.colorize(),
            format.printf(
                (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
            ),
            level: "info",
        }),
        new transports.File({ filename }),
        ],
    });
}
