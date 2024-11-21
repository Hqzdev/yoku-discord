const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Level = require('../../models/Level'); 
const calculateLevelXp = require('../../utils/calculateLevelXp')

module.exports = {
  name: 'addxp',
  description: 'Add experience points to a user',
  devOnly: true,
  options: [
    {
      name: 'user',
      description: 'The user to whom you want to give XP',
      type: ApplicationCommandOptionType.User,
      required: true, // Пользователь обязателен
    },
    {
      name: 'amount',
      description: 'The amount of XP you want to give',
      type: ApplicationCommandOptionType.Integer,
      required: true, // Количество XP обязательно
      minValue: 1, // Минимальное значение XP
    },
  ],
  
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const targetUser = interaction.options.getUser('user'); // Получаем указанного пользователя
    const amount = interaction.options.getInteger('amount'); // Получаем количество добавляемого XP
    const guildId = interaction.guild.id;
    const userId = targetUser.id;

    // Ищем пользователя в базе данных или создаем новый профиль
    let userLevelData = await Level.findOne({ guildId, userId });
    if (!userLevelData) {
      userLevelData = await Level.create({ guildId, userId, level: 1, xp: 0 });
    }

    // Добавляем XP к текущему опыту пользователя
    userLevelData.xp += amount;

    // Проверяем, достиг ли пользователь нового уровня
    const nextLevelXP = calculateLevelXp(userLevelData.level); // Используем уже существующую функцию
    let leveledUp = false;

    while (userLevelData.xp >= nextLevelXP) {
      userLevelData.xp -= nextLevelXP;
      userLevelData.level += 1;
      leveledUp = true;
    }

    // Сохраняем обновленные данные пользователя
    await userLevelData.save();

    // Создаем Embed для отображения информации
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('🎉 XP Added!')
      .setDescription(`${amount} XP has been added to ${targetUser.username}.`)
      .addFields(
        { name: 'Current Level', value: `${userLevelData.level}`, inline: true },
        { name: 'Current XP', value: `${userLevelData.xp}`, inline: true },
        { name: 'XP to Next Level', value: `${calculateLevelXp(userLevelData.level)}`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    if (leveledUp) {
      embed.addFields({ name: 'Level Up!', value: `${targetUser.username} has reached level ${userLevelData.level}!` });
    }

    // Отправляем сообщение с результатом
    interaction.reply({ embeds: [embed] });
  },
};
