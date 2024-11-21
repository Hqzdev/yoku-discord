const Clan = require('../../models/Clan');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'kick-from-clan',
  description: 'Kick a member from your clan (for leaders only)',
  options: [
    {
      name: 'member',
      description: 'The member to kick from the clan',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const targetMember = interaction.options.getUser('member');
    const userId = interaction.user.id;

    // Проверяем, является ли пользователь лидером клана
    const clan = await Clan.findOne({ leader: userId });
    if (!clan) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | You are not the leader of any clan!', ephemeral: true });
    }

    // Проверяем, является ли участник членом клана
    if (!clan.members.includes(targetMember.id)) {
      return interaction.reply({ content: `<:freeiconcross391116:1288790867204898846>  | ${targetMember.username} is not a member of your clan.`, ephemeral: true });
    }

    // Лидер не может исключить сам себя
    if (targetMember.id === userId) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | You cannot kick yourself from your own clan!', ephemeral: true });
    }

    // Удаляем участника из клана
    clan.members = clan.members.filter(member => member !== targetMember.id);
    await clan.save();

    const embed = new EmbedBuilder()
      .setTitle('Member Kicked')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  ${targetMember.username} has been kicked from the clan **${clan.name}**.`)
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
