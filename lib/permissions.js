const { config } = require("./config");

module.exports = {
  IS_ADMINISTRATOR: {
    userIDs: [
      config.ADMINISTRATOR_ID
    ]
  }
};