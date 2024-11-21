const { Client, Interaction, EmbedBuilder } = require('discord.js');
const Clan = require('../../models/Clan');
const UserSettings = require('../../models/UserSettings'); 
const dailyAmountMin = 500; 
const dailyAmountMax = 1500; 
const cooldownDuration = 28800000; 

module.exports = {
  name: 'clan-timely',
  description: 'Collect your money!',
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

      // Calculate cooldown
      const lastDaily = user ? user.lastDaily : new Date(0);
      const cooldownRemaining = cooldownDuration - (Date.now() - lastDaily.getTime());

      if (cooldownRemaining > 0) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
          .setDescription(`<:freeiconmoneybag3141962:1288482986651680778> | You can collect your reward in **${Math.round(cooldownRemaining / 28800000)}h.** `);

        interaction.editReply({ embeds: [embed] });
        return;
      }

      const randomDailyAmount = Math.floor(Math.random() * (dailyAmountMax - dailyAmountMin + 1)) + dailyAmountMin;

      if (user) {
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      clan.def += randomDailyAmount;
      await clan.save();

      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`<:freeiconcross391116:1288790867204898846>  | You recived **${randomDailyAmount}** <:defcoin:1283789986386149377> | Come back in **${Math.round(cooldownRemaining / cooldownDuration)}h. **h. **`);
        
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /timely: ${error}`);
    }
  },
};
