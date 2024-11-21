const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const Level = require('../../models/Level');

module.exports = {
  name: 'profile',
  description: 'Shows information about the user profile',
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const member = interaction.member; // Текущий участник
    const user = interaction.user; // Пользователь
    const guild = interaction.guild;
    const channel = interaction.channel;
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const guildId = interaction.guild.id;
    const userId = targetUser.id;

    // Получение количества сообщений в канале от данного участника
    const messages = await channel.messages.fetch({ limit: 100 });
    let messageCount = 0;
    messages.forEach(msg => {
      if (msg.author.id === member.id) {
        messageCount++;
      }
    });

    // Поиск пользователя в базе данных
    const query = {
      userId: interaction.member.id,
      guildId: interaction.guild.id,
    };

    let dbUser = await User.findOne(query).catch(err => {
      console.error('Error fetching user from database:', err);
      return null;
    });

    if (!dbUser) {
      await interaction.reply({ content: 'User profile not found in the database.', ephemeral: true });
      return;
    }
    const userLevelData = await Level.findOne({ guildId, userId });
    
    const { level } = userLevelData;
    // Создание первоначального эмбеда с информацией о пользователе
    const embed = new EmbedBuilder()
      .setTitle(`${member.user.username}`)
      .setDescription(`<:freeicondailyroutine14991730:1288480944172306486> | **Activity:** Sends ${messageCount} messages in this channel\n<:level:1288145639963754586> | **Level:** ${level}`)
      .setColor(embedColor)
      .setTimestamp()
      .setThumbnail(member.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL() });

    // Создание меню выбора для дополнительной информации
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('profile_menu')
      .setPlaceholder('Additional information')
      .addOptions([
        new StringSelectMenuOptionBuilder()
          .setLabel('Server information')
          .setDescription('Roles, messages')
          .setValue('server-info')
          .setEmoji('<:freeiconhomepage3858444:1288483844181459047>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Account information')
          .setDescription('Creation date, nickname, joining date')
          .setValue('account-info')
          .setEmoji('<:level:1288145639963754586>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Balance')
          .setDescription('Default and Premium balance')
          .setValue('balance-info')
          .setEmoji('<:freeiconmoneybag3141962:1288482986651680778> '),
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Ответ с эмбед и меню
    await interaction.reply({
      embeds: [embed],
      components: [row]
    });

    // Установка фильтра и создания коллектора для обработки меню
    const filter = i => i.customId === 'profile_menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    // Обработка выбора в меню
    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();

      switch (i.values[0]) {
        case 'server-info':
          responseEmbed.setColor(embedColor)
            .setTitle(`${member.user.username}'s Roles`)
            .setDescription(`<:freeiconprofessionalservices1477:1288472749333024840> | **Roles:** ${member.roles.cache.map(role => `<@&${role.id}>`).join(', ')}`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });
          break;
        case 'account-info':
          responseEmbed.setColor(embedColor)
            .setTitle(`${member.user.username}' Info`)
            .setDescription(`<:freeicondailyroutine14991730:1288480944172306486> | **Creation date:** __${user.createdAt.toLocaleDateString()}__\n<:freeiconprofessionalservices1477:1288472749333024840> | **Joining date to the server:** __${member.joinedAt.toLocaleDateString()}__`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });
          break;
        case 'balance-info':
          responseEmbed.setColor(embedColor)
            .setTitle(`<@${user.id}>'s Balance`)
            .setDescription(`\n<:freeiconmoneybag3141962:1288482986651680778>| Money: **${dbUser.default}**\n<:freeicondollar1538306:1288482964757282882> | Premium money: **${dbUser.premium}**`)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Server: ${guild.name}`, iconURL: guild.iconURL() });
          break;
          }

          await i.reply({ embeds: [responseEmbed], ephemeral: true });
        });
    
        // Обработка завершения времени действия коллектора
        collector.on('end', collected => {
          if (collected.size === 0) {
            interaction.followUp({ content: 'Time for selection has expired!', ephemeral: true });
          }
        });
      },
    };
