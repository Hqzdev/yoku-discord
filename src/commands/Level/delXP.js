const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Level = require('../../models/Level'); 
const calculateLevelXp = require('../../utils/calculateLevelXp');

module.exports = {
  name: 'delxp',
  description: 'Delete experience points from a user',
  options: [
    {
      name: 'user',
      description: 'The user from whom you want to delete XP',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of XP you want to delete',
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 1,
    },
  ],
  
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const targetUser = interaction.options.getUser('user'); // Получаем указанного пользователя
    const amount = interaction.options.getInteger('amount'); // Получаем количество удаляемого XP
    const guildId = interaction.guild.id;
    const userId = targetUser.id;

    // Ищем пользователя в базе данных
    let userLevelData = await Level.findOne({ guildId, userId });
    if (!userLevelData) {
      return interaction.reply({ content: `${targetUser.username} has no level data yet.`, ephemeral: true });
    }

    // Удаляем XP у пользователя
    userLevelData.xp -= amount;

    // Проверяем, если XP меньше 0, откатываем уровень
    while (userLevelData.xp < 0 && userLevelData.level > 1) {
      userLevelData.level -= 1;
      userLevelData.xp += calculateLevelXp(userLevelData.level); // Добавляем опыт предыдущего уровня, чтобы компенсировать падение уровня
    }

    // Если XP ушло ниже 0 на первом уровне, просто обнуляем его
    if (userLevelData.xp < 0 && userLevelData.level === 1) {
      userLevelData.xp = 0;
    }

    // Сохраняем обновленные данные пользователя
    await userLevelData.save();

    // Создаем Embed для отображения информации
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('❌ XP Deleted!')
      .setDescription(`${amount} XP has been deleted from ${targetUser.username}.`)
      .addFields(
        { name: 'Current Level', value: `${userLevelData.level}`, inline: true },
        { name: 'Current XP', value: `${userLevelData.xp}`, inline: true },
        { name: 'XP to Next Level', value: `${calculateLevelXp(userLevelData.level) - userLevelData.xp}`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    // Отправляем сообщение с результатом
    interaction.reply({ embeds: [embed] });
  },
};
