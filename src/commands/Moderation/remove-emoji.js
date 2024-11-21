const { SlashCommandBuilder, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'remove-emoji',
    description: "Remove an emoji from the server",
    options: [
      {
        name: 'emoji',
        description: 'The name or ID of the emoji to remove',
        required: true,
        type: ApplicationCommandOptionType.Number,
      },
    ],
    callback: async (client, interaction) => {
    // Проверяем, есть ли у пользователя права управлять эмодзи
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
      return interaction.reply({ content: 'You do not have permission to manage emojis.', ephemeral: true });
    }

    const emojiInput = interaction.options.getString('emoji');
    const guild = interaction.guild;

    // Попытка найти эмодзи по имени или ID
    const emoji = guild.emojis.cache.find(e => e.name === emojiInput || e.id === emojiInput);

    if (!emoji) {
      return interaction.reply({ content: `Emoji "${emojiInput}" not found.`, ephemeral: true });
    }

    // Удаляем эмодзи
    try {
      await emoji.delete();
      return interaction.reply({ content: `Emoji "${emoji.name}" has been removed from the server.`, ephemeral: true });
    } catch (error) {
      console.error('Error removing emoji:', error);
      return interaction.reply({ content: 'An error occurred while trying to remove the emoji.', ephemeral: true });
    }
  },
};
