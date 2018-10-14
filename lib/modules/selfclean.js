module.exports = ({ bot, log }) => {
  bot.registerCommand("selfclean",
    async msg => {
      const dm = await msg.author.getDMChannel();

      const messages = await dm.getMessages();

      messages
        .filter(m => m.author.id === bot.user.id)
        .map(m => m.id)
        .forEach(msgId => {
          log.info(`Deletion job for ${msg.author.username} (${msg.author.id}) ${msgId}`);
          bot.deleteMessage(dm.id, msgId);
        });
    },
    {
      description: "Removes all direct messages sent by this bot"
    }
  );
};