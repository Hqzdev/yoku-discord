const { SlashCommandBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');

module.exports = {
  name: 'say',
  description: 'Write a message on behalf of the bot',
  devOnly: true,
  options: [
    {
      name: 'text',
      description: 'The text that will be in Yoku\'s message',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'channel',
      description: 'Channel where the message will go',
      type: ApplicationCommandOptionType.Channel,
      required: false
    }
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    // Получаем значения из опций команды
    const color = interaction.options.getString('color');
    const text = interaction.options.getString('text');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // Проверка правильности цвета
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      await interaction.editReply({
        content: '<:freeiconcross391116:1288790867204898846>  | Invalid hex color code. Please try again with a correct one (e.g., #FF5733).',
        ephemeral: true,
      });
      return;
    }

    // Проверка, является ли выбранный канал текстовым
    if (channel.type !== ChannelType.GuildText) {
      await interaction.editReply({
        content: '<:freeiconcross391116:1288790867204898846>  | The selected channel is not a text channel.',
        ephemeral: true,
      });
      return;
    }

    // Отправляем сообщение в указанный канал
    await channel.send({
      content: `${text}`
    });

    // Подтверждение отправки
    await interaction.editReply({
      content: `<:freeiconcheckbox1168610:1288790836712308779>  | The message has been successfully sent to ${channel}.`,
      ephemeral: true
    });
  },
};
