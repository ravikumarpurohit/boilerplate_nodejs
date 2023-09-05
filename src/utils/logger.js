const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint, colorize, errors, align, printf, simple } = format;
require("winston-daily-rotate-file");
const basePath = "./logs/";

const filter = (level) =>
  format((info) => {
    if (info.level === level) {
      return info;
    }
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
          if (info.stack) {
            return `${info.timestamp} ${info.level}:${info.message} \nStack:\n\t ${info.stack}`;
          }
          return `${info.timestamp} ${info.level}:${info.message}`;
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
          if (info.stack) {
            return `${info.timestamp} ${info.level}:${info.message} \nStack:\n\t ${info.stack}`;
          }
          return `${info.timestamp} ${info.level}: ${info.message}`;
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
      format: format.combine(
        filter("http"),
        errors({ stack: true }),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        printf((info) => {
          if (info.stack) {
            return `${info.timestamp} ${info.level}:${info.message} \nStack:\n\t ${info.stack}`;
          }
          return `${info.timestamp} ${info.level}: ${info.message}`;
        })
      ),
      json: false,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  dash.add(
    new transports.Console({
      format: format.combine(
        errors({ stack: true }),
        prettyPrint(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((info) => {
          if (info.stack) {
            return `${info.timestamp} ${info.level}:${info.message} \n ${info.stack}`;
          }
          return `${info.timestamp} ${info.level}: ${info.message}`;
        })
      ),
      json: true,
    })
  );
}

//#region Methods
const info = (message, requestURL = null, extraPayload = null) => {
  dash.info(`${message}, RequestURL: ${requestURL}, OtherDetails: ${extraPayload == {} ? "" : extraPayload}`);
};
const error = (error, requestURL, extraPayload = {}) => {
  dash.error(`${error}, RequestURL: ${requestURL}, OtherDetails: `, extraPayload);
};
const fatal = (error, requestURL, extraPayload = {}) => {
  dash.fatal(`${error} RequestURL: ${requestURL} `, extraPayload);
};
const debug = (extraPayload) => {
  dash.debug(extraPayload);
};
const logger = { info, error, fatal, debug };

//#endregion

module.exports = {
  logger,
};
