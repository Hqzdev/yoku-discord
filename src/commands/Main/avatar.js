const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Send your avatar',
  options: [
    {
      name: 'member',
      description: 'The user whose avatar you want to get.',
      type: ApplicationCommandOptionType.User,
    },
  ],


  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const member = interaction.member;
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle(`<:freeiconpersonalizedsupport14773:1288480922382893108> | ${member.user.username} avatar`) 
      .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 })); 

    await interaction.reply({ embeds: [embed] });
  },
};

