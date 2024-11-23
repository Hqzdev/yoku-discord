const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mute a member in the server',
  options: [
    {
      name: 'user',
      description: 'Select a user to mute',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'duration',
      description: 'Duration of the mute (in minutes)',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for the mute',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846> | You can only run this command inside a server.');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetUser = interaction.options.getUser('user');    
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(targetUser.id);

    // Проверка прав пользователя
    if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846> | You do not have permission to mute members.');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверка наличия пользователя на сервере
    if (!member) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcross391116:1288790867204898846> | Could not find user <@${targetUser.id}> in this server.`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Проверка, может ли бот замьютить этого пользователя
    if (!member.manageable) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcross391116:1288790867204898846> | I cannot mute <@${targetUser.id}>.`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      // Применение мьюта с таймером
      await member.timeout(duration * 60 * 1000, reason);

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | <@${targetUser.id}> was muted for **${duration}** minutes.\nReason: **${reason}**`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error muting user: ${error}`);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846> | An error occurred while trying to mute this member.');
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
