const Clan = require('../../models/Clan');
const { EmbedBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'delete-clan',
  description: 'Delete your clan (for leaders only)',
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const userId = interaction.user.id;

    // Проверяем, является ли пользователь лидером клана
    const clan = await Clan.findOne({ leader: userId });
    if (!clan) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | You are not the leader of any clan!', ephemeral: true });
    }

    // Удаляем клан
    await Clan.deleteOne({ leader: userId });

    const embed = new EmbedBuilder()
      .setTitle('Clan Deleted')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  The clan **${clan.name}** has been deleted.`)
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
