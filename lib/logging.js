const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const Transport = require("winston-transport");
const AWSCloudWatch = require("winston-aws-cloudwatch");

const { config } = require("./config");

const formatMessage = info =>
  `[${info.timestamp} ${info.level.toUpperCase()}] ${info.label}: ${info.message}`;
const logMessageFormat = printf(formatMessage);

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

class DiscordTransport extends Transport {
  constructor(bot) {
    super();
    this.bot = bot;
  }

  log(info, callback) {
    const logChannel = this.bot.getChannel(config.DEBUG_LOG_CHANNEL);

    logChannel.createMessage(formatMessage(info));

    callback();
  }
}

function _createLogger(logLabel, loggers) {
  return createLogger({
    format: combine(
      label({ label: logLabel }),
      ...DEFAULT_LOG_FORMAT
    ),
    transports: loggers
  });
}

function createLabeledLogger(logLabel) {
  return _createLogger(logLabel, [
    new transports.Console(),
    ...(USING_CLOUDWATCH ? [cloudWatchTransport] : [])
  ]);
}

function createLabeledBotLogger(logLabel, bot) {
  return _createLogger(logLabel, [
    new transports.Console(),
    new DiscordTransport(bot),
    ...(USING_CLOUDWATCH ? [cloudWatchTransport] : [])
  ]);
}

const serverLogger = createLabeledLogger("system");

module.exports = {
  serverLogger,
  createLogger: createLogger,
  createBotLogger: createLabeledBotLogger
};