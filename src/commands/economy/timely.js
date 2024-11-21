const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); // Модель для хранения пользовательских настроек
const User = require('../../models/User'); // Модель пользователя, где хранится баланс

module.exports = {
  name: 'timely',
  description: 'Claim your daily earnings',
  
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    const timelyAmount = userSettings?.timelyAmount || 100; // Если нет пользовательского значения, то 100 по умолчанию


    let user = await User.findOne({ userId, guildId });
    if (!user) {
      user = new User({ userId, guildId, balance: 0 });
    }

    // Добавляем заработок
    user.balance += timelyAmount;
    await user.save();

    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setDescription(`💰 | You have claimed **${timelyAmount}** coins! Your new balance is **${user.balance}** coins.`);

    interaction.reply({ embeds: [embed] });
  },
};
