const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'See the list of available commands',

  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const member = interaction.member;
    await interaction.deferReply();

    // Основной Embed с информацией о командах
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('📬 Need help? Here are all of my commands')
      .setDescription('Use **select menu** to learn more about the command categories.')
      .setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() });

      const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Select a command category')
      .addOptions([
        new StringSelectMenuOptionBuilder()
          .setLabel('Owner')
          .setValue('owner')
          .setEmoji('<:freeiconcrown2350683:1288483884882722826>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Clan')
          .setValue('clan')
          .setEmoji('<:freeiconitservices14773826:1288480903449940061>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Economy')
          .setValue('economy')
          .setEmoji('<:freeicondollar1538306:1288482964757282882>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Fun')
          .setValue('fun')
          .setEmoji('<:freeiconlaugh2058208:1288483867111456798>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Giveaway')
          .setValue('giveaway')
          .setEmoji('<:freeicongiveaway4659059:1288483802670301236>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Main')
          .setValue('main')
          .setEmoji('<:freeiconhomepage3858444:1288483844181459047>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Moderation')
          .setValue('moderation')
          .setEmoji('<:freeiconprofessionalservices1477:1288472749333024840>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Music')
          .setValue('music')
          .setEmoji('<:freeiconmusicnote5391441:1288483825042853960>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Level')
          .setValue('level')
          .setEmoji('<:level:1288145639963754586>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Reminder')
          .setValue('reminder')
          .setEmoji('<:freeicondailyroutine14991730:1288480944172306486>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Settings')
          .setValue('settings')
          .setEmoji('<:freeiconefficiency14991726:1288471655290634322>'),
          
        new StringSelectMenuOptionBuilder()
          .setLabel('Ticket')
          .setValue('ticket')
          .setEmoji('<:freeiconpersonalizedsupport14773:1288480922382893108>')
      ]);
    
    // Добавляем Select Menu в Action Row
    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Отправляем сообщение с Embed и меню
    await interaction.editReply({ embeds: [embed], components: [row] });

    // Создаём коллектор для Select Menu
    const filter = (i) => i.customId === 'help-menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    // Обработка выбора в Select Menu
    collector.on('collect', async (i) => {
      let categoryEmbed = new EmbedBuilder().setColor('#303135');

      switch (i.values[0]) {
        case 'owner':
            categoryEmbed
                .setTitle('<:freeiconcrown2350683:1288483884882722826> Owner Commands')
                .setDescription('`/add-money`: Adds a specified amount of money to a user.\n' +
                                '`/autorole-config`: Configure automatic role assignment for new members.\n' +
                                '`/bans`: View the list of banned users on the server.\n' +
                                '`/delete-money`: Removes a specified amount of money from a user.\n' +
                                '`/dm`: Sends a direct message to a specific user.\n' +
                                '`/manage-idea`: Manage user suggestions.\n' +
                                '`/mutes`: View users who are currently muted.\n' +
                                '`/reset-tep`: Reset specific settings.\n' +
                                '`/say`: Allows the bot to say something on behalf of the server.\n' +
                                '`/unban`: Unban a user from the server.\n' +
                                '`/update`: Updates specific settings or information on the server.');
            break;
    
        case 'clan':
            categoryEmbed
                .setTitle('<:freeiconitservices14773826:1288480903449940061> Clan Commands')
                .setDescription('`/balance-clan`: Check the balance of the clan.\n' +
                                '`/clan-info`: View information about the clan.\n' +
                                '`/create-clan`: Create a new clan.\n' +
                                '`/customize`: Customize clan settings (name, description, etc.).\n' +
                                '`/delete-clan`: Delete the clan.\n' +
                                '`/join`: Join a clan.\n' +
                                '`/kick-clan`: Kick a member from the clan.\n' +
                                '`/leave`: Leave the current clan.');
            break;
    
        case 'economy':
            categoryEmbed
                .setTitle('<:freeicondollar1538306:1288482964757282882> Economy Commands')
                .setDescription('`/balance`: Check user balance.\n' +
                                '`/buy`: Buy an item from the shop.\n' +
                                '`/convert`: Convert money from one currency to another.\n' +
                                '`/give`: Transfer money to another user.\n' +
                                '`/leaderboard`: View the leaderboard for money.\n' +
                                '`/shop`: Open the shop for purchases.\n' +
                                '`/timely`: Get money for active chatting time.');
            break;
    
        case 'fun':
            categoryEmbed
                .setTitle('<:freeiconlaugh2058208:1288483867111456798> Fun Commands')
                .setDescription('`/afk`: Set status as "Away From Keyboard".\n' +
                                '`/meme`: Get a random meme.\n' +
                                '`/translate`: Translate text into another language.\n' +
                                '`/weather`: Check the current weather in a specified location.');
            break;
    
        case 'giveaway':
            categoryEmbed
                .setTitle('<:freeicongiveaway4659059:1288483802670301236> Giveaway Commands')
                .setDescription('`/create`: Start a giveaway.');
            break;
    
        case 'main':
            categoryEmbed
                .setTitle('<:freeiconhomepage3858444:1288483844181459047> Main Commands')
                .setDescription('`/avatar`: Display user avatar.\n' +
                                '`/idea`: Share an idea or suggestion with others.\n' +
                                '`/info`: Get basic information about the server.\n' +
                                '`/invite`: Create an invite link to the server.\n' +
                                '`/membercount`: Check the number of members on the server.\n' +
                                '`/ping`: Display bot latency.\n' +
                                '`/profile`: View your profile.\n' +
                                
                            '`/server-info`: Get information about the server.\n' +
                            '`/server`: Display overall information about the server.\n' +
                            '`/status-idea`: Check the status of a proposed idea.\n' +
                            '`/user-info`: Get information about a user.');
        break;

    case 'moderation':
        categoryEmbed
            .setTitle('<:freeiconprofessionalservices1477:1288472749333024840> Moderation Commands')
            .setDescription('`/ban`: Ban a user.\n' +
                            '`/check-report`: Check reports of violations.\n' +
                            '`/clean-emoji`: Remove emojis from the server.\n' +
                            '`/clean-user`: Delete messages from a specific user.\n' +
                            '`/clean`: Delete a specified number of messages from the channel.\n' +
                            '`/cooldowns`: Manage cooldowns for commands.\n' +
                            '`/kick`: Kick a user from the server.\n' +
                            '`/mute`: Mute a user (prevent them from speaking).\n' +
                            '`/nickname-history`: View the nickname history of a user.\n' +
                            '`/nickname-set`: Set a new nickname for a user.\n' +
                            '`/nickname-remove`: Remove the nickname of a user.\n' +
                            '`/report`: Report a user for misconduct.\n' +
                            '`/unmute`: Unmute a user.');
        break;

    case 'music':
        categoryEmbed
            .setTitle('<:freeiconmusicnote5391441:1288483825042853960> Music Commands')
            .setDescription('`/join`: Join a voice channel.\n' +
                            '`/leave`: Leave the voice channel.\n' +
                            '`/play`: Play a music track.');
        break;

    case 'level':
        categoryEmbed
            .setTitle('<:level:1288145639963754586> Level Commands')
            .setDescription('`/rank`: Check your rank in the leveling system.');
        break;

    case 'reminder':
      categoryEmbed
      .setTitle('<:freeicondailyroutine14991730:1288480944172306486> Reminder Commands')
      .setDescription('`/ready` - Prepare / set a reminder.\n' + 
        '`/remind` - Set a specific reminder.');
        break;
        case 'settings':
          categoryEmbed
          .setTitle('<:freeiconpersonalizedsupport14773:1288480922382893108> Settings Commands')
          .setDescription('`/settings` - Open the bot or server settings menu.');
            break;
      case 'ticket':
      categoryEmbed
      .setTitle('<:freeiconefficiency14991726:1288471655290634322> Ticket Command')
      .setDescription('`/create-ticket` - Create a new support ticket.\n'+'`/delete-ticket` - Delete a support ticket.')
}

    

      await i.update({ embeds: [categoryEmbed], components: [row] });
    });

    // Завершение работы с меню, если оно не было использовано
    collector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'Menu expired. Please run the command again to view help.', components: [] });
      }
    });
  },
};
