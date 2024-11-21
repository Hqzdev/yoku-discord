const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const EconomyLog = require('../../models/EconomyLog'); // Модель логов экономики
const UserSettings = require('../../models/UserSettings');

module.exports = {
  name: 'economylog',
  description: 'View the latest economy logs.',
  
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const guildId = interaction.guild.id;

    await interaction.deferReply();

    // Получение последних 10-15 логов экономики
    const logs = await EconomyLog.find({ guildId })
      .sort({ date: -1 }) // Сортировка по дате (от новых к старым)
      .limit(25); // Ограничение на 15 записей
      console.log(logs);

    if (!logs || logs.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('⚠️ | No economy logs found for this server.');
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // Формируем список логов
    const logMessages = logs.map(log => {
      const date = new Date(log.date).toLocaleString();
      if (log.type === 'add') {
        return `📥 **${log.amount}** added to <@${log.userId}> on ${date}`;
      } else if (log.type === 'transfer') {
        return `🔄 **${log.amount}** transferred from <@${log.userId}> to <@${log.targetUserId}> on ${date}`;
      } else if (log.type === 'remove') {
        return `📤 **${log.amount}** removed from <@${log.userId}> on ${date}`;
      } else {
        return `❓ Unknown log type on ${date}`;
      }
    });

    // Создаем Embed
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('Economy Logs')
      .setDescription(logMessages.join('\n').slice(0, 4096)) // Ограничение длины сообщения
      .setFooter({ text: `Showing up to 15 latest logs.` });

    interaction.editReply({ embeds: [embed], ephemeral: true });
  },
};
