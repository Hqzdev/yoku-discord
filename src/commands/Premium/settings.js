const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const RoleAssignment = require('../../models/RoleAssignment');
const EconomySettings = require('../../models/EconomySettings')
const UserSettings = require('../../models/UserSettings')

module.exports = {

  name: 'settings',
  description: 'Bot module settings',
  devOnly: true,
  callback: async (client, interaction) => {
        // Получаем опции
        const user = interaction.options.getMember('user');
        const message = interaction.options.getString('message');
        const member = interaction.member;
    const embed = new EmbedBuilder()
    .setTitle(`Setting up bot modules.`)
      .setDescription(`<:freeiconefficiency14991726:1288471655290634322> | Interact with the drop-down selection menu **to configure** the server.`)
      .setColor('#303135')
      .setTimestamp()
      .setFooter({ text: `Request from ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('settings_menu')
      .setPlaceholder('Select the desired setting')
      .addOptions([
        new StringSelectMenuOptionBuilder()
          .setLabel('Automatic role assignment')
          .setEmoji('<:freeiconprofessionalservices1477:1288472749333024840>')
          .setValue('role'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Logs system')
          .setEmoji('<:freeiconefficiency14991726:1288471655290634322>')
          .setValue('logs'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Economy')
          .setEmoji('<:freeiconmoneybag3141962:1288482986651680778>')
          .setValue('economy'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Color of system messages')
          .setEmoji('<:emoji_145:1289106625730449408>')
          .setValue('color'),
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false
    });

    const filter = i => i.customId === 'settings_menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder();
      let newRow;
      let buttonRow;

      switch (i.values[0]) {
        case 'role': {
          const guild = interaction.guild;
          let roleSettings = await RoleAssignment.findOne({ guildId: guild.id });

          if (!roleSettings) {
            roleSettings = await RoleAssignment.create({ guildId: guild.id, roles: [], autoAssignEnabled: false });
          }

          const roles = guild.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => ({
              label: role.name,
              value: role.id,
              description: `ID: ${role.id}`,
            }));

          const maxRolesInMenu = roles.slice(0, 25);

          const roleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('role-selection')
            .setPlaceholder('Select roles for new members')
            .setMinValues(1)
            .setMaxValues(maxRolesInMenu.length)
            .addOptions(maxRolesInMenu);

          const toggleButton = new ButtonBuilder()
            .setCustomId('toggle-role-assignment')
            .setLabel(roleSettings.autoAssignEnabled ? 'Disable Auto-Role Assignment' : 'Enable Auto-Role Assignment')
            .setStyle(roleSettings.autoAssignEnabled ? ButtonStyle.Danger : ButtonStyle.Success);

          const embed = new EmbedBuilder()
            .setColor('#303135')
            .setTitle('Auto-Role Assignment Settings')
            .setDescription(
              `Roles for new members: ${roleSettings.roles.length ? roleSettings.roles.map(roleId => `<@&${roleId}>`).join(', ') : 'None'}\n` +
              `Auto-Role Assignment is currently **${roleSettings.autoAssignEnabled ? 'Enabled' : 'Disabled'}**.`
            );

          const roleRow = new ActionRowBuilder().addComponents(roleSelectMenu);
          const buttonRow = new ActionRowBuilder().addComponents(toggleButton);

          await i.update({ embeds: [embed], components: [roleRow, buttonRow] });

          const collector = i.channel.createMessageComponentCollector({ filter, time: 60000 });

          collector.on('collect', async i => {
            if (i.customId === 'role-selection') {
              const selectedRoles = i.values;
              roleSettings.roles = selectedRoles;
              await roleSettings.save();

              await i.update({
                embeds: [embed.setDescription(`Roles for new members updated: ${selectedRoles.map(roleId => `<@&${roleId}>`).join(', ')}\nAuto-Role Assignment is currently **${roleSettings.autoAssignEnabled ? 'Enabled' : 'Disabled'}**.`)],
                components: [roleRow, buttonRow],
              });
            }

            if (i.customId === 'toggle-role-assignment') {
              roleSettings.autoAssignEnabled = !roleSettings.autoAssignEnabled;
              await roleSettings.save();

              toggleButton.setLabel(roleSettings.autoAssignEnabled ? 'Disable Auto-Role Assignment' : 'Enable Auto-Role Assignment');
              toggleButton.setStyle(roleSettings.autoAssignEnabled ? ButtonStyle.Danger : ButtonStyle.Success);

              await i.update({
                embeds: [embed.setDescription(`Roles for new members: ${roleSettings.roles.length ? roleSettings.roles.map(roleId => `<@&${roleId}>`).join(', ') : 'None'}\nAuto-Role Assignment is currently **${roleSettings.autoAssignEnabled ? 'Enabled' : 'Disabled'}**.`)],
                components: [roleRow, buttonRow],
              });
            }
          });
          break;
        }
          case 'economy': {
            const guild = interaction.guild;
  
            // Ищем настройки экономики для текущего сервера
            let economySettings = await EconomySettings.findOne({ guildId: guild.id });
            if (!economySettings) {
              economySettings = await EconomySettings.create({ guildId: guild.id, dailyBonus: 100, multiplierRoles: {}, conversionRate: 1 });
            }
  
            // Создаём select меню для изменения параметров экономики
            const economyMenu = new StringSelectMenuBuilder()
              .setCustomId('economy-settings')
              .setPlaceholder('Select an option to configure')
              .addOptions([
                new StringSelectMenuOptionBuilder()
                  .setLabel('Change Daily Bonus')
                  .setValue('daily_bonus')
                  .setEmoji('💰'),
                new StringSelectMenuOptionBuilder()
                  .setLabel('Set Role Multiplier')
                  .setValue('role_multiplier')
                  .setEmoji('🛡️'),
                new StringSelectMenuOptionBuilder()
                  .setLabel('Set Conversion Rate')
                  .setValue('conversion_rate')
                  .setEmoji('🔄'),
              ]);
  
            const row = new ActionRowBuilder().addComponents(economyMenu);
            const embed = new EmbedBuilder()
              .setColor('#303135')
              .setTitle('Economy Settings')
              .setDescription(
                `Current Daily Bonus: **${economySettings.dailyBonus}**\n` +
                `Role Multipliers: ${Object.keys(economySettings.multiplierRoles).length > 0 ? Object.keys(economySettings.multiplierRoles).map(roleId => `<@&${roleId}>: x${economySettings.multiplierRoles[roleId]}`).join(', ') : 'None'}\n` +
                `Conversion Rate: **1 Premium = ${economySettings.conversionRate} Regular**`
              );
  
            await i.update({ embeds: [embed], components: [row] });
  
            const economyCollector = i.channel.createMessageComponentCollector({ filter, time: 60000 });
  
            economyCollector.on('collect', async i => {
              if (i.customId === 'economy-settings') {
                switch (i.values[0]) {
                  case 'daily_bonus':
                    await i.update({
                      embeds: [new EmbedBuilder().setDescription('Enter a new value for the daily bonus:').setColor('#303135')],
                    });
  
                    const bonusCollector = i.channel.createMessageCollector({ filter, time: 30000, max: 1 });
                    bonusCollector.on('collect', async message => {
                      const newBonus = parseInt(message.content);
                      if (!isNaN(newBonus)) {
                        economySettings.dailyBonus = newBonus;
                        await economySettings.save();
                        await message.reply(`Daily bonus updated to **${newBonus}**.`);
                      } else {
                        await message.reply('Invalid value. Please enter a valid number.');
                      }
                    });
                    break;
  
                  case 'role_multiplier':
                    await i.update({
                      embeds: [new EmbedBuilder().setDescription('Mention the role and the multiplier (e.g., `@Role 2`)').setColor('#303135')],
                    });
  
                    const multiplierCollector = i.channel.createMessageCollector({ filter, time: 30000, max: 1 });
                    multiplierCollector.on('collect', async message => {
                      const [roleMention, multiplier] = message.content.split(' ');
                      const role = message.mentions.roles.first();
                      const multiplierValue = parseFloat(multiplier);
                      if (role && !isNaN(multiplierValue)) {
                        economySettings.multiplierRoles[role.id] = multiplierValue;
                        await economySettings.save();
                        await message.reply(`Multiplier for role <@&${role.id}> set to **x${multiplierValue}**.`);
                      } else {
                        await message.reply('Invalid input. Please mention a role and provide a valid multiplier.');
                      }
                    });
                    break;
  
                  case 'conversion_rate':
                    await i.update({
                      embeds: [new EmbedBuilder().setDescription('Enter a new conversion rate (e.g., `2` means 1 Premium = 2 Regular)').setColor('#303135')],
                    });
  
                    const conversionCollector = i.channel.createMessageCollector({ filter, time: 30000, max: 1 });
                    conversionCollector.on('collect', async message => {
                      const newRate = parseFloat(message.content);
                      if (!isNaN(newRate)) {
                        economySettings.conversionRate = newRate;
                        await economySettings.save();
                        await message.reply(`Conversion rate updated to **1 Premium = ${newRate} Regular**.`);
                      } else {
                        await message.reply('Invalid value. Please enter a valid number.');
                      }
                    });
                    break;
                }
              }
            });
            break;
        }
        case 'color': {
            // Получаем информацию о сервере (гильдии)
            const guild = interaction.guild;
          
            // Ищем текущие настройки цвета для сервера
            let userSettings = await UserSettings.findOne({ guildId: guild.id, userId: interaction.user.id });
            if (!userSettings) {
              userSettings = await UserSettings.create({ guildId: guild.id, userId: interaction.user.id, systemColor: '#303135' });
            }
          
            // Создаем Embed с текущим цветом и инструкциями для пользователя
            const colorEmbed = new EmbedBuilder()
              .setColor(userSettings.systemColor)
              .setTitle('System Message Color Settings')
              .setDescription(`Current color: **${userSettings.systemColor}**.\nPlease enter a new color in HEX format (e.g., #FF5733).`);
          
            // Отправляем сообщение с Embed и инструкцией пользователю ввести HEX-код
            await i.update({ embeds: [colorEmbed] });
          
            // Создаем фильтр для получения ответа от пользователя
            const filter = (response) => {
              return response.author.id === interaction.user.id;
            };
          
            // Ожидаем ввод от пользователя
            const collector = i.channel.createMessageCollector({ filter, time: 60000 });
          
            collector.on('collect', async (response) => {
              const inputColor = response.content;
          
              // Проверяем, что пользователь ввел корректный HEX-код
              const hexRegex = /^#[0-9A-F]{6}$/i;
              if (!hexRegex.test(inputColor)) {
                return i.channel.send('❌ Invalid HEX code! Please try again with a correct HEX color code (e.g., #FF5733).');
              }
          
              // Обновляем цвет системных сообщений в базе данных
              userSettings.systemColor = inputColor;
              await userSettings.save();
          
              // Создаем Embed с обновленным цветом
              const updatedEmbed = new EmbedBuilder()
                .setColor(inputColor)
                .setTitle('System Message Color Updated')
                .setDescription(`System message color has been updated to **${inputColor}**.`);
          
              // Отправляем сообщение о том, что цвет был обновлен
              await i.channel.send({ embeds: [updatedEmbed] });
          
              // Завершаем коллектор
              collector.stop();
            });
          
            // Завершение сбора, если время ожидания истекло
            collector.on('end', (collected, reason) => {
              if (reason === 'time') {
                i.channel.send('⏰ Time is up! You didn\'t provide a valid color.');
              }
            });
          
            break;
          }
          
      }
    });
  },
};
 