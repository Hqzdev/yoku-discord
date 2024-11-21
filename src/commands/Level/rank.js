const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXp = require('../../utils/calculateLevelXp'); // Функция для расчета XP на уровень

module.exports = {
  name: 'rank',
  description: "Shows your/someone's level.",
  options: [
    {
      name: 'target-user',
      description: 'The user whose level you want to see.',
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;
    const userId = targetUser.id;

    // Ищем данные о уровне пользователя в базе данных
    const userLevelData = await Level.findOne({ guildId, userId });

    if (!userLevelData) {
      return interaction.reply({ content: `${targetUser.username} has no level data yet.`, ephemeral: true });
    }

    const { level, xp } = userLevelData;
    const nextLevelXp = calculateLevelXp(level); // XP на следующий уровень
    const remainingXp = nextLevelXp - xp; // Сколько осталось до следующего уровня

    // Создаем Embed для отображения уровня
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle(`<:level:1288145639963754586> Level`)
      .addFields(
        { name: '<:freeiconreview6919832:1289916129405440125> | Level', value: `${level}`, inline: true },
        { name: '<:freeiconexperience7919881:1289916113529995285> | XP', value: `${xp} / ${nextLevelXp}`, inline: true },
        { name: '<:freeiconlevelup4614145:1289916096169902111> | XP to next level', value: `${remainingXp}`, inline: true }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
