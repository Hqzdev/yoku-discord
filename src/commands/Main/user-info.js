const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Check user information',
  options: [
    {
      name: 'user',
      description: 'The user whose information you want to check',
      type: 6, // Type 6 соответствует типу User
      required: false
    }
  ],
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const user = interaction.options.getUser('user') || interaction.user;
    const TargetMember = interaction.guild.members.cache.get(user.id);
    
    // Определяем высшую роль пользователя
    const highestRole = TargetMember.roles.highest;
    const member = interaction.member;

    // Создаем Embed для отображения информации
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTimestamp(Date.now())
      .setAuthor({ name: `${user.username}'s Information`, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL())
      .setDescription(`
        **__General Information__**
        **Name:** ${user.username}
        **ID:** ${user.id}
        **Nickname:** ${TargetMember.nickname ? TargetMember.nickname : 'None'}
        **Bot?:** ${user.bot ? '✅ Yes' : '❎ No'}
        **Account Created:** <t:${parseInt(user.createdTimestamp / 1000)}:R>
        **Server Joined:** <t:${parseInt(TargetMember.joinedTimestamp / 1000)}:R>

        **__Role Information__**
        **Highest Role:** ${highestRole}
        **Roles:** ${TargetMember.roles.cache.map(r => r).join(' ').replace("@everyone", " ") || "None"}
      `)
      .setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() });

    // Отправляем ответ с информацией
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
