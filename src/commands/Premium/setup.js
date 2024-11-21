const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings'); // Модель для хранения настроек гильдии в базе данных

module.exports = {
  name: 'setup',
  description: 'Manage event triggers (join/leave announcements, etc.)',
  premium: true,
  callback: async (client, interaction) => {
    const guildId = interaction.guild.id;

    // Ищем настройки для текущей гильдии
    let guildSettings = await GuildSettings.findOne({ guildId });
    if (!guildSettings) {
      guildSettings = await GuildSettings.create({ guildId, joinMessageEnabled: false, leaveMessageEnabled: false });
    }

    // Основной Embed с инструкциями
    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('Event Control Panel')
      .setDescription('Select an event and enable/disable it.')
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    // Создаём Select Menu для выбора событий
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('event-control-menu')
      .setPlaceholder('Select an event to configure')
      .addOptions([
        new StringSelectMenuOptionBuilder()
          .setLabel('Join Event (User joins the server)')
          .setValue('join')
          .setDescription('Announce when someone joins the server.'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Leave Event (User leaves the server)')
          .setValue('leave')
          .setDescription('Announce when someone leaves the server.')
      ]);

    // Кнопки включения/выключения события
    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Отправляем сообщение с Embed и селект-меню
    await interaction.reply({ embeds: [embed], components: [row] });

    // Создаём коллектор для Select Menu
    const filter = (i) => i.customId === 'event-control-menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    // Обрабатываем выбор в Select Menu
    collector.on('collect', async (i) => {
      let eventEmbed = new EmbedBuilder().setColor('#303135');

      // Кнопки для включения/выключения события
      const eventToggleButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('enable-event')
          .setLabel('Enable')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('disable-event')
          .setLabel('Disable')
          .setStyle(ButtonStyle.Danger)
      );

      switch (i.values[0]) {
        case 'join':
          eventEmbed.setTitle('Join Event').setDescription('Enable or disable the join event.');
          await i.update({ embeds: [eventEmbed], components: [eventToggleButtons] });

          // Обработка кнопок включения/выключения для Join Event
          const joinCollector = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 60000,
          });

          joinCollector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'enable-event') {
              guildSettings.joinMessageEnabled = true;
              await guildSettings.save();
              await buttonInteraction.reply({ content: 'Join event enabled!', ephemeral: true });
            } else if (buttonInteraction.customId === 'disable-event') {
              guildSettings.joinMessageEnabled = false;
              await guildSettings.save();
              await buttonInteraction.reply({ content: 'Join event disabled!', ephemeral: true });
            }
          });
          break;

        case 'leave':
          eventEmbed.setTitle('Leave Event').setDescription('Enable or disable the leave event.');
          await i.update({ embeds: [eventEmbed], components: [eventToggleButtons] });

          // Обработка кнопок включения/выключения для Leave Event
          const leaveCollector = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 60000,
          });

          leaveCollector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'enable-event') {
              guildSettings.leaveMessageEnabled = true;
              await guildSettings.save();
              await buttonInteraction.reply({ content: 'Leave event enabled!', ephemeral: true });
            } else if (buttonInteraction.customId === 'disable-event') {
              guildSettings.leaveMessageEnabled = false;
              await guildSettings.save();
              await buttonInteraction.reply({ content: 'Leave event disabled!', ephemeral: true });
            }
          });
          break;
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'No event selected in time.', components: [] });
      }
    });
  },
};
