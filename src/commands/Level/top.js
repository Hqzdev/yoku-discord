const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXp = require('../../utils/calculateLevelXp');

module.exports = {
  name: 'top',
  description: "Shows the top users by level in the server.",
  
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const guildId = interaction.guild.id;

    await interaction.deferReply();

    try {
      // Получаем всех пользователей с данными о уровне, отсортированных по уровню и XP
      const topUsers = await Level.find({ guildId }).sort({ level: -1, xp: -1 }).limit(10);

      if (!topUsers.length) {
        return interaction.editReply({ content: 'There are no level data for this server yet.', ephemeral: true });
      }

      // Формируем текст для каждого пользователя
      const topUsersText = topUsers.map((userData, index) => {
        const member = interaction.guild.members.cache.get(userData.userId);
        const username = member ? member.user.username : 'Unknown User';
        const nextLevelXp = calculateLevelXp(userData.level); // Используем уровень пользователя
        return `${index + 1}. ${username} - Level: ${userData.level}, XP: **${userData.xp}/${nextLevelXp}**`;
      }).join('\n');

      // Создаем Embed для отображения топа
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('🏆 Top 10 Users by Level')
        .setDescription(topUsersText)
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching top users:', error);
      interaction.editReply({ content: 'An error occurred while fetching the top users.', ephemeral: true });
    }
  },
};
