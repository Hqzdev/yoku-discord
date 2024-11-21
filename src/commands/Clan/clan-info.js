const Clan = require('../../models/Clan');
const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'clan-info',
  description: 'Get information about a clan',
  options: [
    {
      name: 'clan-name',
      description: 'The name of the clan you want information about',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const clanName = interaction.options.getString('clan-name');

    // Проверяем, существует ли клан
    const clan = await Clan.findOne({ name: clanName });
    if (!clan) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | This clan does not exist!', ephemeral: true });
    }

    const memberMentions = clan.members.map(id => `<@${id}>`).join('\n');
    const embed = new EmbedBuilder()
      .setTitle(`Clan: ${clan.name}`)
      .setDescription(clan.description || 'No description provided.')
      .addFields(
        { name: 'Leader', value: `<@${clan.leader}>`, inline: true },
        { name: 'Members', value: memberMentions || 'No members', inline: false }
      )
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
