const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const TempRole = require('../../models/TempRole');

module.exports = {
  name: 'remove-temp-role',
  description: 'Remove a temporary role from a user',
  options: [
    {
      name: 'user',
      description: 'The user you want to remove the role from',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'role',
      description: 'The role you want to remove',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

    const guildMember = await interaction.guild.members.fetch(user.id);
    await guildMember.roles.remove(role); // Удаляем роль

    // Удаляем временную роль из базы данных
    await TempRole.deleteOne({ guildId: interaction.guild.id, userId: user.id, roleId: role.id });

    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setDescription(`<:freeiconcross391116:1288790867204898846> | Temporary role **${role.name}** removed from ${user.username}.`);
    interaction.reply({ embeds: [embed] });
  },
};
