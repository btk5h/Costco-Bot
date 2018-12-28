const dotenv = require("dotenv");

module.exports.updateConfiguration = async ({ bot, log }) => {
  const configChannelId = process.env.CONFIG;
  const configChannel = bot.getChannel(configChannelId);

  log.info(`Config channel is ${configChannelId}`);

  const messages = await configChannel.getMessages(2);

  if (messages.length !== 1) {
    log.error(`The configuration channel may only have one message in it.`);
    return;
  }

  const config = messages[0].content;
  module.exports.config = dotenv.parse(config);

};