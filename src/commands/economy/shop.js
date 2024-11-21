const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require('discord.js');
const User = require('../../models/User');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'shop',
  description: "Server's shop",
  disabled: false,

  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    await interaction.deferReply({ ephemeral: false }); // Сообщение теперь будет невидимым

    const query = {
      userId: interaction.member.id,
      guildId: interaction.guild.id,
    };

    let user = await User.findOne(query).catch(err => {
      console.error('Error fetching user:', err);
      return null; // Handle situation if user is not found or error occurs
    });

    if (!user) {
      await interaction.editReply({ content: '<:freeiconcross391116:1288790867204898846>  | You do not have a user profile in the database.'});
      return;
    }

    // Создание селект-меню с опциями для разделов
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('shop-menu')
      .setPlaceholder('Select a category from the shop')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Roles')
          .setDescription('Buy roles with premium coins')
          .setValue('roles')
          .setEmoji('<:freeiconhomepage3858444:1288483844181459047>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Temporary roles')
          .setDescription('Buy temporary roles')
          .setValue('temporary-roles')
          .setEmoji('<:freeicondailyroutine14991730:1288480944172306486>'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Auto-workers')
          .setDescription('Auto-workers section (not available)')
          .setValue('auto-workers')
          .setEmoji('<:freeiconmoneybag3141962:1288482986651680778> '),
      );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Создание первоначального эмбеда с инструкцией
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('Role Store')
      .setDescription(`<:freeiconhomepage3858444:1288483844181459047> - **Roles**\nRegular roles with unlimited duration\n\n<:freeicondailyroutine14991730:1288480944172306486>  - **Temporary roles**\nRoles with limited duration. More privileges!\n\n<:freeiconpremiumaccount15356705:1288470104924754022> - **Auto workers**\nAutomatic currency earnings using roles.\n\n**Money:** __${user.default}__ <:freeiconmoneybag3141962:1288482986651680778>\n**Premium money:** __${user.premium}__ <:freeicondollar1538306:1288482964757282882> `)
      .setTimestamp()

    // Отправка эмбеда с меню
    await interaction.editReply({ embeds: [embed], components: [row] });

    // Обработка выбора из меню
    const filter = i => i.customId === 'shop-menu' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      let responseEmbed = new EmbedBuilder()
      .setColor(embedColor)

      switch (i.values[0]) {
        case 'roles':
          responseEmbed
            .setTitle('Roles')
            .setDescription('**Prices:**\n<@&1020688223653077043>, <@&1116043993705369752>, <@&1020688223653077043>, <@&1116043896280076339>, <@&1116044170612715653>, <@&1116044069186060338> - **5 premium coins**');
          break;
        case 'temporary-roles':
          responseEmbed
            .setTitle('Temporary Roles')
            .setDescription('**Prices:**\n <@&1014204406553641170> - `50`\n <@&1014203638509473834> - `75`\n <@&1014203904575148052> - `100`');
          break;
        case 'auto-workers':
          responseEmbed
            .setTitle('Auto-workers')
            .setDescription('Not available yet');
          break;
      }

      await i.update({ embeds: [responseEmbed], components: [row] });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Time expired, please try again.', ephemeral: true });
      }
    });
  },
};
