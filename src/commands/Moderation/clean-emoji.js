const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'clean-emoji',
  description: "Clear a specified number of messages containing emojis from the channel",
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  devOnly: false,
  options: [
    {
      name: 'amount',
      description: 'Number of messages to check (1-100)',
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

      const amount = interaction.options.getInteger('amount');

      // Регулярное выражение для поиска эмодзи
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

      // Получаем последние сообщения канала
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const emojiMessages = messages.filter(msg => emojiRegex.test(msg.content)).first(amount);

      // Удаляем сообщения с эмодзи
      if (emojiMessages.length > 0) {
        await interaction.channel.bulkDelete(emojiMessages, true);

        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Successfully deleted **${emojiMessages.length}** messages containing emojis.`);
        interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription(`<:freeiconcross391116:1288790867204898846> | No messages containing emojis found within the last 100 messages.`);
        interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(`Error with /clean-emoji: ${error}`);
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:freeiconcross391116:1288790867204898846> | An error occurred while trying to delete messages.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
