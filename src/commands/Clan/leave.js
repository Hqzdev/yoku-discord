const Clan = require('../../models/Clan');
const { SlashCommandBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'leave-clan',
  description: 'Leave your current clan',
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const userId = interaction.user.id;

    // Проверяем, состоит ли пользователь в каком-то клане
    const clan = await Clan.findOne({ members: userId });
    if (!clan) {
      return interaction.reply({ content: 'You are not part of any clan!', ephemeral: true });
    }

    // Если пользователь является лидером, нужно удалить клан
    if (clan.leader === userId) {
      await Clan.deleteOne({ name: clan.name });
      return interaction.reply({ content: `<:freeiconcross391116:1288790867204898846>  | You have left and deleted the clan **${clan.name}** as you were the leader.`, ephemeral: true });
    }

    // Если не лидер, просто удаляем его из списка участников
    clan.members = clan.members.filter(member => member !== userId);
    await clan.save();

    return interaction.reply({ content: `<:freeiconcheckbox1168610:1288790836712308779> |  You have left the clan **${clan.name}**.`, ephemeral: true });
  },
};
