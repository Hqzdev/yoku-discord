const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); 
const UserSettings = require('../../models/UserSettings'); 


module.exports = {
  name: 'convert',
  description: 'Convert your currency!',
  options: [
    {
      name: 'amount',
      description: 'How many premium coins do you want to get',
      type: 4, 
      required: true, 
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846>  | You can only run this command inside a server.');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (!user) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
          .setDescription('<:freeiconcross391116:1288790867204898846>  | You don\'t have a profile yet.');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      const amountToConvert = interaction.options.getInteger('amount'); 

      if (amountToConvert > user.balance) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('<:freeiconcross391116:1288790867204898846>  | You don\'t have enough currency to convert this amount.\n```Сoin rate: 1 to 1000````');
        interaction.editReply({ embeds: [embed] });
        return;
      }
      const conversionRate = 1000; 
      const bank = amountToConvert * conversionRate;
      user.default -= amountToConvert * conversionRate;
      user.premium += amountToConvert
      await user.save();

      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  You get **${amountToConvert}** premium coin(s)\n > You can also buy roles for **premium coins** if write __/shop__ command`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /convert: ${error}`);
    }
  },
};
