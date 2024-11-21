const { devs, testServer, premium } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers are allowed to run this command.',
          ephemeral: true,
        });
        return;
      }
    }


    if (commandObject.premium) {
      if (!premium.includes(interaction.member.id)) {
        const embed = new EmbedBuilder()
          .setTitle('<:freeiconpremiumaccount15356705:1288470104924754022> Yoku AI PRO Subscription')
          .setDescription('Yoku Ai PRO is a bonus subscription that unlocks additional features and expands the limits and capabilities of Yoku features.\n\nThis subscription will give you access to more advanced features and tools that allow you to maximize the potential of Yoku.\n\nDon\'t miss your chance to get bonus features and expand your capabilities with Yoku AI PRO.')
          .setColor('#8979f3') 
          .setTimestamp();
    
        // Создание кнопки с ссылкой
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('More Details') 
            .setStyle(ButtonStyle.Link)
            .setEmoji('<:freeiconpremiumaccount15356705:1288470104924754022>')
            .setURL('https://your-premium-link.com') 
        );
    
        interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true,
        });
        return;
      }
    }
    

    if (commandObject.disabled) {
        interaction.reply({
          content: 'Disabled command',
          ephemeral: true,
        });
        return;
    }


    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'This command cannot be ran here.',
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};