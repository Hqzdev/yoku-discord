const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'kick',
  description: "Kick a member from the server",
    /*
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  options: [
    {
      name: 'user',
      description: 'Choose a member to kick',
      required: true,
      type: ApplicationCommandOptionType.User, 
    },
    {
      name: 'reason',
      description: 'Reason for kicking the user',
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  callback: async (client, interaction) => {


    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription('<:freeiconcross391116:1288790867204898846> | You do not have permission to use this command.');
      interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      await interaction.deferReply();

      const member = interaction.options.getUser('user');
      const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
      const reason = interaction.options.getString('reason') || 'No reason provided';

      // Попытка найти участника на сервере
      const guildMember = interaction.guild.members.cache.get(member.id);
      if (!guildMember) {
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setDescription(`<:freeiconcross391116:1288790867204898846> | <@${member.id}> is not on this server or cannot be found.`);
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Кик участника
      await guildMember.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | <@${member.id}> was kicked from the server.\nReason: **${reason}**`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /kick-member: ${error}`);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<:freeiconcross391116:1288790867204898846> | An error occurred while trying to kick <@${member.id}>.`);
      interaction.editReply({ embeds: [embed] });
    }
  },
};
