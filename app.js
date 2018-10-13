const { CommandClient } = require("eris");
const requireDir = require("require-dir");

const { serverLogger, createLogger } = require("./lib/logging");

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  serverLogger.error("The environment variable BOT_TOKEN is not set");
} else {
  startBot();
}

function startBot() {
  serverLogger.info("Starting bot...");

  const bot = new CommandClient(
    BOT_TOKEN,
    {},
    {
      prefix: "!"
    }
  );

  bot.on("ready", () => {
    serverLogger.info("Loading modules...");

    Object.entries(requireDir("./lib/modules"))
      .forEach(([file, module]) => {
        serverLogger.info(`Loading module ${file}`);
        module({ bot, log: createLogger(file) });
      });
  });

  bot.connect();
}
