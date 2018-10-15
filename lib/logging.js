const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const AWSCloudWatch = require("winston-aws-cloudwatch");

const logMessageFormat = printf(info =>
  `[${info.timestamp} ${info.level.toUpperCase()}] ${info.label}: ${info.message}`);

const DEFAULT_LOG_FORMAT = [
  timestamp({
    format: "HH:mm:ss"
  }),
  logMessageFormat
];

const USING_CLOUDWATCH = !!process.env.CLOUDWATCH_LOG_GROUP;

let cloudWatchTransport;

if (USING_CLOUDWATCH) {
  cloudWatchTransport = new AWSCloudWatch({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
      logStreamName: process.env.NODE_ENV || "development",
      createLogStream: true,
      awsConfig: {
        accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
        region: process.env.CLOUDWATCH_REGION
      },
      formatLog: info => `[${info.level.toUpperCase()}] ${info.meta.label}: ${info.message}`
    }
  );
}

function createLabeledLogger(logLabel) {
  return createLogger({
    format: combine(
      label({ label: logLabel }),
      ...DEFAULT_LOG_FORMAT
    ),
    transports: [
      new transports.Console(),
      ...(USING_CLOUDWATCH ? [cloudWatchTransport] : [])
    ]
  });
}

const serverLogger = createLabeledLogger("system");

module.exports = {
  serverLogger,
  createLogger: createLabeledLogger
};