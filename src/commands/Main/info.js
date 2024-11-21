const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'info',
  description: 'Send info about Yoku',

  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const member = interaction.member;
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('About Yoku') // Добавлено заголовок для embed
      .setDescription('Yoku Ai is a **multi-functional bot** designed to enhance your __Discord server__.')
      .addFields(
        { name: '<:freeiconprofessionalservices1477:1288472749333024840> | **Assembly information**', value:'Version: ``1.3``\nDate of creation: ``28.07.24``', inline: true },
        { name: '<:freeiconstreamer15356715:1288469676526927925> | **Support Server**', value: '[Harmony](https://discord.gg/Z4JepuG8SJ)🌙', inline: true },
        { name: '<:freeiconitservices14773826:1288480903449940061> | **Developer**', value: '1.``Haqz.dev\n``(1113473145538613350)', inline: false },
        { name: '<:freeiconremote14820774:1289525880091054172> | **Github**', value: '[Source code](https://github.com/Hqzdev/Yoku-Discord-Bot)'}
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${member.user.tag}`, iconURL: member.user.displayAvatarURL() });
    await interaction.reply({ embeds: [embed] }); 
  },
};
