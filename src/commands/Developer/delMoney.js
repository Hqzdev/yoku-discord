const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User'); 
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'delete-money',
  description: "Delete member's money",
  devOnly: true,
  options: [
    {
      name: 'user',
      description: 'Choice a member',
      required: true,
      type: ApplicationCommandOptionType.User, 
    },
    {
      name: 'amount',
      description: 'How much money you want to delete this user?',
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

      
      const member = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount'); 

      
      let user = await User.findOne({ userId: member.id, guildId: interaction.guild.id });

      if (!user) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
          .setDescription(`<:freeiconcross391116:1288790867204898846>  | <@${member.id}> doesn't have a profile yet.`);
        interaction.editReply({ embeds: [embed] });
        return;
      }

      
      user.default -= amount;
      await user.save();

      
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  You deleted <@${member.id}>'s money **${amount}**`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /delete-money: ${error}`);
    }
  },
};
