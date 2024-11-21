const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const TempRole = require('../../models/TempRole');

module.exports = {
  name: 'active-temp-roles',
  description: 'View all active temporary roles',
  callback: async (client, interaction) => {
    const tempRoles = await TempRole.find({ guildId: interaction.guild.id });

    if (!tempRoles.length) {
      return interaction.reply('There are no active temporary roles.');
    }

    const roleList = tempRoles.map((role) => `User: <@${role.userId}>, Role: <@&${role.roleId}>, Expires: ${role.expirationTime}`).join('\n');

    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('<:level:1288145639963754586> | Active Temporary Roles')
      .setDescription(roleList);

    interaction.reply({ embeds: [embed] });
  },
};
