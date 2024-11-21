const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Clan = require('../../models/Clan');
const UserSettings = require('../../models/UserSettings'); 

module.exports = {
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:freeiconcheckbox1168610:1288790836712308779> |  You can only run this command inside a server.');
      
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // Получение ID пользователя, инициировавшего команду
    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply();

    // Ищем клан пользователя в базе данных
    const clan = await Clan.findOne({ members: targetUserId });

    if (!clan) {
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  This clan does not exist!`);
      
      interaction.editReply({ embeds: [embed] });
      return;
    }

    // Формирование ответа с балансом клана
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle(`Clan Balance`)
      .setDescription(`\n > Money: **${clan.def || 0}** <:freeiconmoneybag3141962:1288482986651680778>\n  > Premium money: **${clan.prem || 0}** <:freeicondollar1538306:1288482964757282882>`);
      
    interaction.editReply({ embeds: [embed], ephemeral: true });
  },

  name: 'balance-clan',
  description: "See clan's balance",
  options: [
    {
      name: 'user',
      description: 'Select a user to see their clan balance',
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ]
};
