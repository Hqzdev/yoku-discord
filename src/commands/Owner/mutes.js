const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'mutes',
  description: 'Check all muted users on the server',
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
      const muteList = await interaction.guild.mute.fetch();

      if (banList.size === 0) {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setDescription('<:freeiconcross391116:1288790867204898846>  | There are no muted users on this server.');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Формируем список забаненных пользователей
      const muteListDescription = muteList.map(mute => `• **${mute.user.tag}** (ID: ${mute.user.id})`).join('\n');
      const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

      const embed = new EmbedBuilder()
        .setTitle('muted Users')
        .setDescription(`Here is the list of muted users on the server:\n\n${muteListDescription}`)
        .setColor(embedColor);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /mutes: ${error}`);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846>  | An error occurred while fetching the mute list.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
