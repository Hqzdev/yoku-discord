const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'invite',
  description: 'Invite Yoku',

  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    await interaction.deferReply();
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setDescription(`<:freeiconpersonalizedsupport14773:1288480922382893108> | To add me to your server click the **button** below`);
      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('💌 Invite Me')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/oauth2/authorize?client_id=1281304366153859125&permissions=8&integration_type=0&scope=bot+applications.commands') // Замените ссылку на нужную
      );
    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};
