import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, prettyPrint, errors, align, printf } = format;
const basePath = "./logs/";

const filter = (level) =>
  format((info) => {
    return info.level === level ? info : false;
  })();

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  http: 5,
};

const dash = createLogger({
  levels,
  transports: [
    new transports.File({
      level: "error",
      filename: `${basePath}error.log`,
      format: combine(
        filter("error"),
        errors({ stack: true }),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        printf((info) => {
          return info.stack
            ? `${info.timestamp} ${info.level}:${info.message} \nStack:\n\t ${info.stack}`
            : `${info.timestamp} ${info.level}:${info.message}`;
        })
      ),
      json: true,
    }),
    new transports.File({
      level: "fatal",
      filename: `${basePath}fatal.log`,
      format: combine(
        filter("fatal"),
        errors({ stack: true }),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        printf((info) => {
          return info.stack
            ? `${info.timestamp} ${info.level}:${info.message} \nStack:\n\t ${info.stack}`
            : `${info.timestamp} ${info.level}: ${info.message}`;
        })
      ),
      json: true,
    }),
    new transports.File({
      level: "info",
      filename: `${basePath}info.log`,
      format: combine(
        filter("info"),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        printf((info) => `${info.timestamp} ${info.level}:${info.message}`)
      ),
    }),
    new transports.File({
      level: "debug",
      filename: `${basePath}debug.log`,
      format: combine(
        filter("debug"),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        printf((info) => `${info.timestamp} ${info.level}:${info.message}`)
      ),
    }),
    new transports.File({
      filename: `${basePath}http.log`,
      level: "http",
      format: combine(
        filter("http"),
        errors({ stack: true }),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        printf((info) => {
          return info.stack
            ? `${info.timestamp} ${info.level}:${info.message} \nStack:\n\t ${info.stack}`
            : `${info.timestamp} ${info.level}: ${info.message}`;
        })
      ),
      json: false,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  dash.add(
    new transports.Console({
      format: combine(
        errors({ stack: true }),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((info) => {
          return info.stack
            ? `${info.timestamp} ${info.level}:${info.message} \n ${info.stack}`
            : `${info.timestamp} ${info.level}: ${info.message}`;
        })
      ),
      json: true,
    })
  );
}

//#region Methods
const info = (message, requestURL = null, extraPayload = null) => {
  dash.info(
    `${message}, RequestURL: ${requestURL}, OtherDetails: ${
      Object.keys(extraPayload || {}).length ? JSON.stringify(extraPayload) : ""
    }`
  );
};

const error = (err, requestURL, extraPayload = {}) => {
  dash.error(`${err}, RequestURL: ${requestURL}, OtherDetails: `, extraPayload);
};

const fatal = (err, requestURL, extraPayload = {}) => {
  dash.fatal(`${err} RequestURL: ${requestURL} `, extraPayload);
};

const debug = (extraPayload) => {
  dash.debug(extraPayload);
};

const logger = { info, error, fatal, debug };
//#endregion

export { logger };
