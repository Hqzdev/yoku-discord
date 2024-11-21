const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const clan = require('../../models/Clan'); 
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'add-money-clan',
  description: 'Add money to clan',
  devOnly: true,
  options: [
    {
      name: 'clan',
      description: 'Choice a clan',
      required: true,
      type: 3, 
    },
    {
      name: 'amount',
      description: 'How much money you want to add this clan?',
      required: true,
      type: 4,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';

    
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846>  | You do not have permission to use this command.');
      interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await interaction.deferReply();

      
      const clan = interaction.options.getUser('clan');
      const amount = interaction.options.getInteger('amount'); 

      
      let user = await User.findOne({ userId: member.id, guildId: interaction.guild.id });

      if (!user) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
          .setDescription(`<:freeiconcross391116:1288790867204898846>  | This clan does not exist!`);
        interaction.editReply({ embeds: [embed] });
        return;
      }

      
      clan.def += amount;
      await user.save();

      
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  You added money **${amount}** to this clan `);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /add-money-clan: ${error}`);
    }
  },
};
