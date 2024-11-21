const Clan = require('../../models/Clan');
const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'join-clan',
  description: 'Join a clan',
  options: [
    {
      name: 'clan-name',
      description: 'The name of the clan you want to join',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const clanName = interaction.options.getString('clan-name');
    const userId = interaction.user.id;
    const role = '1116040100699181166';
    // Проверяем, не состоит ли пользователь уже в каком-то клане
    const existingClan = await Clan.findOne({ members: userId });
    if (existingClan) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | You are already in a clan!', ephemeral: true });
    }

    // Проверяем, существует ли клан с таким именем
    const clan = await Clan.findOne({ name: clanName });
    if (!clan) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | This clan does not exist!', ephemeral: true });
    }

    // Добавляем пользователя в клан
    clan.members.push(userId);
    await clan.save();
    await member.roles.add(role);
    const embed = new EmbedBuilder()
      .setTitle('Joined Clan!')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  You have successfully joined **${clanName}**.`)
      .addFields({ name: 'Clan Leader', value: `<@${clan.leader}>`, inline: true })
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
