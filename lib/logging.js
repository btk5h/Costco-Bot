const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const logMessageFormat = printf(info =>
  `[${info.timestamp} ${info.level.toUpperCase()}] ${info.label}: ${info.message}`);

const DEFAULT_LOG_FORMAT = [
  timestamp({
    format: "HH:mm:ss"
  }),
  logMessageFormat
];


function createLabeledLogger(logLabel) {
  return createLogger({
    format: combine(
      label({ label: logLabel }),
      ...DEFAULT_LOG_FORMAT
    ),
    transports: [
      new transports.Console()
    ]
  });
}

const serverLogger = createLabeledLogger("system");

module.exports = {
  serverLogger,
  createLogger: createLabeledLogger
};