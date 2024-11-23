const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'clean',
  description: "Clear a specified number of messages from the channel",
  /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  devOnly: false,
  options: [
    {
      name: 'amount',
      description: 'Number of messages to delete (1-100)',
      required: true,
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      maxValue: 100,
    },
  ],
  callback: async (client, interaction) => {

    // Проверка прав
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846> | You do not have permission to use this command.');
      interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      const amount = interaction.options.getInteger('amount');    
      const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

      const deletedMessages = await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Successfully deleted **${deletedMessages.size}** messages.`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /clear: ${error}`);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846>| An error occurred while trying to clear messages.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
