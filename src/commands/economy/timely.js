const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const UserSettings = require('../../models/UserSettings');

module.exports = {
  name: 'timely',
  description: 'Claim your daily earnings',

  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    // Ограничение времени в миллисекундах (3 часа)
    const cooldown = 3 * 60 * 60 * 1000;

    // Генерация рандомного базового заработка от 500 до 2500
    const timelyAmountBase = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;

    // Определяем ID ролей и множители
    const roleMultipliers = [
      { roleId: '1012034055346331659', multiplier: 3 },
      { roleId: '1011149306209771570', multiplier: 2 },
      { roleId: '1114200576624959580', multiplier: 5 },
    ];

    // Проверяем, какие роли есть у пользователя
    const member = interaction.guild.members.cache.get(userId);
    let multiplier = 1; // Базовый множитель
    let roleMessage = 'You have claimed your daily earnings.'; // Базовое сообщение

    for (const { roleId, multiplier: roleMultiplier } of roleMultipliers) {
      const role = interaction.guild.roles.cache.get(roleId);
      if (role && member.roles.cache.has(role.id)) {
        multiplier = roleMultiplier;
        roleMessage = `💎 | As a member with the role ID <@&${role.id}>, you get x${multiplier} earnings!`;
        break;
      }
    }

    const timelyAmount = timelyAmountBase * multiplier; // Итоговая сумма заработка

    // Получаем пользователя из базы данных или создаем его профиль
    let user = await User.findOne({ userId, guildId });
    if (!user) {
      user = new User({ userId, guildId, balance: 0, lastTimely: 0 });
    }

    // Проверка времени последнего использования команды
    const now = Date.now();
    if (user.lastTimely && now - user.lastTimely < cooldown) {
      const remainingTime = cooldown - (now - user.lastTimely);
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(
          `⏳ | You have already claimed your earnings! Please wait **${hours}h ${minutes}m** before using this command again.`
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Обновляем баланс и время последнего использования команды
    user.balance += timelyAmount;
    user.lastTimely = now;
    await user.save();

    // Создаем Embed для ответа
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setDescription(
        `${roleMessage}\n<:freeiconlevelup4614145:1289916096169902111> | You have claimed **${timelyAmount}** coins\n Base: **${timelyAmountBase}** Multiplier: **x${multiplier}**! \nYour new balance is **${user.balance}** coins.`
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
