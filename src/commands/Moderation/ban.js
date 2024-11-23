const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server',
  options: [
    {
      name: 'user',
      description: 'Select a user to ban',
      type: 6, 
      required: true,
    },
    {
      name: 'reason',
      description: 'Reason for the ban',
      type: 3, 
      required: false,
    },
    {
      name: 'days',
      description: 'Number of days of messages to delete (0-7)',
      type: 4, 
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846> | You can only run this command inside a server.');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      const member = interaction.options.getUser('user');
      const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const days = interaction.options.getInteger('days') || 0;

      const guildMember = interaction.guild.members.cache.get(member.id);
      if (!guildMember) {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setDescription(`
<:freeiconcross391116:1288790867204898846> | <@${member.id}> is not on this server or cannot be found.`);
        interaction.editReply({ embeds: [embed] });
        return;
      }


      await guildMember.ban({ reason, days });

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | <@${member.id}> was banned from the server.\nReason: **${reason}**. Deleted **${days}** days of messages.`);
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /ban: ${error}`);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`
<:freeiconcross391116:1288790867204898846> | An error occurred while trying to ban <@${member.id}>.`);
      interaction.editReply({ embeds: [embed] });
    }
  },
};
