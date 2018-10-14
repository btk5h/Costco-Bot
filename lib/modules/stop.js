const { IS_ADMINISTRATOR } = require("../permissions");
module.exports = ({ bot }) => {

  bot.registerCommand("stop", () => {
    bot.disconnect();
  }, {
    description: "Disconnects the bot from the server",
    requirements: {
      ...IS_ADMINISTRATOR
    }
  });
};
