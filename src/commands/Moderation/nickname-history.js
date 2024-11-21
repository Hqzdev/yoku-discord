const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
module.exports = {
  name: 'nickname-history',
  description: "Show the nickname history of a user",
  options: [
    {
      name: 'user',
      description: 'The user whose nickname history you want to see',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser('user');

    try {
      const dbUser = await User.findOne({ userId: targetUser.id });

      if (!dbUser || !dbUser.nicknames || dbUser.nicknames.length === 0) {
        return interaction.reply({
          content: `${targetUser.username} does not have any recorded nickname history.`,
          ephemeral: true,
        });
      }

      const nicknameHistory = dbUser.nicknames
        .map((entry, index) => `${index + 1}. ${entry.nickname} (changed on: ${new Date(entry.date).toLocaleDateString()})`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle(`${targetUser.username}'s Nickname History`)
        .setDescription(nicknameHistory)
        .setColor('#303135')
        .setTimestamp()
        .setFooter({ text: 'Nickname history', iconURL: targetUser.displayAvatarURL({ dynamic: true }) });

      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.log(`Error fetching nickname history: ${error}`);
      interaction.reply({
        content: 'An error occurred while retrieving the nickname history.',
        ephemeral: true,
      });
    }
  },
};
