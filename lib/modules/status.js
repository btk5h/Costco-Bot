module.exports = ({ bot }) => {
  bot.editStatus(
    null,
    {
      name: "!help",
      type: 3
    }
  );
};