const { config } = require("../config");
const VCNOTIFIER_CATEGORY = config.VCNOTIFIER_CATEGORY;

module.exports = ({ bot, log }) => {
  if (!VCNOTIFIER_CATEGORY) {
    log.error("The config option VCNOTIFIER_CATEGORY is not set");
    return;
  }

  const notifierCategory = bot.getChannel(VCNOTIFIER_CATEGORY);

  if (!notifierCategory || notifierCategory.type !== 4) {
    log.error(`The notifier category (${VCNOTIFIER_CATEGORY}) does not exist`);
    return;
  }

  bot.on("voiceChannelJoin", handleJoin);
  bot.on("voiceChannelSwitch", handleJoin);

  const summonCooldown = new Set();

  async function handleJoin(initialMember, newChannel) {
    const channelId = newChannel.id;
    const guild = newChannel.guild;

    if (
      newChannel.parentID !== VCNOTIFIER_CATEGORY
      || newChannel.voiceMembers.size !== 1
      || summonCooldown.has(channelId)
    ) {
      return;
    }

    summonCooldown.add(channelId);
    setTimeout(() => summonCooldown.delete(channelId), 300000); // 5 minutes

    const invite = await newChannel.createInvite({
      maxAge: 1800 // 30 minutes
    });
    const inviteLink = `https://discord.gg/${invite.code}`;

    const embed = {
      title: `You have been summoned by ${initialMember.nick || initialMember.username}!`,
      timestamp: new Date().toISOString(),
      description: `[Click here to join \"${newChannel.name}\"](${inviteLink})`
    };

    const messagedMembers = new Set();

    const overwrites = newChannel.permissionOverwrites
      .filter(o => o.id !== guild.id) // ignore @everyone role
      .values();

    for (const overwrite of overwrites) {
      const id = overwrite.id;

      switch (overwrite.type) {
        case "member":
          if (!messagedMembers.has(id)) {
            const member = guild.members.find(m => m.id === id);
            const dm = await member.user.getDMChannel();
            dm.createMessage({ embed });
            
            messagedMembers.add(id);
          }
          break;
        case "role":
          const membersToMessage = guild.members
            .filter(m => m.roles.includes(id))
            .filter(m => m.id !== initialMember.id)
            .filter(m => !messagedMembers.has(m.id))
            .values();

          for (const member of membersToMessage) {
            const dm = await member.user.getDMChannel();
            dm.createMessage({ embed });

            messagedMembers.add(member.id);
          }
          break;
        default:
          log.warn(`Unhandled permission overwrite type: ${overwrite.type}`);
      }
    }

    messagedMembers.forEach(log.info);
  }
};

