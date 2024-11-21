const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BanPool = require('../../models/Banpool');
const UserSettings = require('../../models/UserSettings'); 

module.exports = {
  name: 'banpool-delete',
  description: 'Delete a ban pool.',
  options: [
    {
      name: 'name',
      description: 'The name of the ban pool to delete.',
      type: 3, // STRING
      required: true,
    },
  ],
  
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const poolName = interaction.options.getString('name');
    const guildId = interaction.guild.id;

    // Проверяем, существует ли банпул
    const existingPool = await BanPool.findOne({ poolName, guildId });
    if (!existingPool) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846> |No ban pool found with this name!', ephemeral: true });
    }

    await BanPool.deleteOne({ poolName, guildId });

    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('Ban Pool Deleted')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Ban pool **${poolName}** has been deleted!`);

    interaction.reply({ embeds: [embed] });
  },
};
