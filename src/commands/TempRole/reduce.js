const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const TempRole = require('../../models/TempRole');

module.exports = {
  name: 'reduce-temp-role-time',
  description: 'Reduce the time of a temporary role',
  options: [
    {
      name: 'user',
      description: 'The user whose role time you want to reduce',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'role',
      description: 'The role you want to reduce time for',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'time',
      description: 'Time in minutes to reduce',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const timeToReduce = interaction.options.getInteger('time');

    const tempRole = await TempRole.findOne({ guildId: interaction.guild.id, userId: user.id, roleId: role.id });
    
    if (!tempRole) {
      return interaction.reply('This user does not have the specified temporary role.');
    }

    tempRole.expirationTime = new Date(tempRole.expirationTime.getTime() - timeToReduce * 60 * 1000);
    await tempRole.save();

    const embed = new EmbedBuilder()
    .setColor('#303135')
      .setDescription(`<:freeicondailyroutine14991730:1288480944172306486> | Reduced **${timeToReduce}** minutes from the temporary role **${role.name}** for ${user.username}. New expiration: ${tempRole.expirationTime}`);
    interaction.reply({ embeds: [embed] });
  },
};
