const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); // Импортируем настройки пользователя

module.exports = {
  name: 'ping',
  description: 'Pong!',

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    // Получаем цвет системных сообщений пользователя из базы данных
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; // Если пользователь не настроил цвет, используется цвет по умолчанию


    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Pong!')
      .setDescription(`<:level:1288145639963754586> | Client: ${ping}ms | Websocket: ${client.ws.ping}ms`);

    await interaction.editReply({ embeds: [embed] });
  },
};
