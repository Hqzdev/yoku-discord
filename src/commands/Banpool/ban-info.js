const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BanPool = require('../../models/Banpool');
const UserSettings = require('../../models/UserSettings');

module.exports = {
  name: 'banpool-info',
  description: 'Get detailed information about a ban pool.',
  options: [
    {
      name: 'pool-name',
      description: 'The name of the ban pool to display information for.',
      type: 3, // STRING
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const poolName = interaction.options.getString('pool-name');
    const guildId = interaction.guild.id;

    // Найти банпул по имени
    const pool = await BanPool.findOne({ poolName, guildId });

    if (!pool) {
      return interaction.reply({
        content: '<:freeiconcross391116:1288790867204898846> | Ban pool not found.',
        ephemeral: true,
      });
    }

    // Формируем список серверов и забаненных пользователей
    const servers = pool.servers.length > 0
      ? pool.servers.map((serverId, index) => `${index + 1}. Server ID: **${serverId}**`).join('\n')
      : 'No servers in this pool.';

    const bannedUsers = pool.bannedUsers.length > 0
      ? pool.bannedUsers
          .map(
            (user, index) =>
              `${index + 1}. User ID: **${user.userId}** - Reason: **${user.reason || 'No reason provided'}**`
          )
          .join('\n')
      : 'No banned users in this pool.';

    // Создаем Embed с информацией
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`Information for Ban Pool: **${poolName}**`)
      .addFields(
        { name: 'Servers', value: servers, inline: false },
        { name: 'Banned Users', value: bannedUsers, inline: false }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
