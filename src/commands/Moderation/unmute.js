const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute a user',
  options: [
    {
      name: 'user',
      description: 'The user you want to unmute',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser('user');
    const guildMember = interaction.guild.members.cache.get(targetUser.id);

    // Роль мьюта, которая должна быть на сервере
    const muteRole = interaction.guild.roles.cache.find(role => role.name === '⚠️・TextMuted');

    if (!muteRole) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846> | Mute role not found on this server.', ephemeral: true });
    }

    if (!guildMember) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846> | User not found on this server.', ephemeral: true });
    }

    // Проверяем, есть ли у пользователя роль мьюта
    if (!guildMember.roles.cache.has(muteRole.id)) {
      return interaction.reply({ content: `${targetUser.username} is not muted.`, ephemeral: true });
    }

    // Убираем роль мьюта
    try {
      await guildMember.roles.remove(muteRole);

      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | **${targetUser.username}** has been unmuted.`);
      
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error unmuting user: ${error}`);
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846> | There was an error trying to unmute the user.', ephemeral: true });
    }
  },
};
