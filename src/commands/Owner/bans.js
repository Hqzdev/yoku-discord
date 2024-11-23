const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bans',
  description: 'Check all banned users on the server',
  devOnly: true,
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846>  | You can only run this command inside a server.');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      // Получаем список всех банов на сервере
      const banList = await interaction.guild.bans.fetch();

      if (banList.size === 0) {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setDescription('There are no banned users on this server.');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Формируем список забаненных пользователей
      const banListDescription = banList.map(ban => `• **${ban.user.tag}** (ID: ${ban.user.id})`).join('\n');
      const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

      const embed = new EmbedBuilder()
        .setTitle('Banned Users')
        .setDescription(`Here is the list of banned users on the server:\n\n${banListDescription}`)
        .setColor(embedColor);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /bans: ${error}`);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846>  | An error occurred while fetching the ban list.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
