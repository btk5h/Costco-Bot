const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { CommandClient } = require("eris");
const requireDir = require("require-dir");

const { updateConfiguration } = require("./lib/config");
const { serverLogger, createLogger, createBotLogger } = require("./lib/logging");

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
      description: "The guardian of Costco",
      owner: "btk5h#9251",
      prefix: "!"
    }
  );

  bot.on("error", err => {
    serverLogger.error(err);
  });

  bot.on("ready", async () => {
    await updateConfiguration({ bot, log: createLogger("config") });

    serverLogger.info("Loading modules...");

    Object.entries(requireDir("./lib/modules"))
      .forEach(([file, module]) => {
        serverLogger.info(`Loading module ${file}`);
        module({ bot, log: createBotLogger(file, bot) });
      });
  });

  bot.connect();
}

