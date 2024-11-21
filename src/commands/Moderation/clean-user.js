const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'clean-user',
  description: "Clear a specified number of messages from the channel for a specific user",
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  devOnly: false,
  options: [
    {
      name: 'user',
      description: 'The user whose messages you want to delete',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'amount',
      description: 'Number of messages to delete (1-100)',
      required: true,
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      maxValue: 100,
    },
  ],
  callback: async (client, interaction) => {
    // Проверка прав
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:freeiconcross391116:1288790867204898846> | You do not have permission to use this command.');
      interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      // Получаем сообщения канала
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const userMessages = messages.filter(msg => msg.author.id === targetUser.id).first(amount);

      // Удаляем сообщения пользователя
      if (userMessages.length > 0) {
        await interaction.channel.bulkDelete(userMessages, true);

        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Successfully deleted **${userMessages.length}** messages from **${targetUser.username}**.`);
        interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<:freeiconcross391116:1288790867204898846> | No messages from **${targetUser.username}** found within the last 100 messages.`);
        interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(`Error with /clean-user: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:freeiconcross391116:1288790867204898846> | An error occurred while trying to delete messages.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
