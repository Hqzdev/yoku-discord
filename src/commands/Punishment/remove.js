const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Punishment = require('../../models/Punishment');

module.exports = {
  name: 'remove-punishment',
  description: 'Remove a punishment from a user',
  options: [
    {
      name: 'user',
      description: 'The user you want to remove punishment from',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'punishment-id',
      description: 'The ID of the punishment you want to remove',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const punishmentId = interaction.options.getString('punishment-id');

    // Проверяем, существует ли такое наказание
    const punishment = await Punishment.findOneAndDelete({ userId: user.id, _id: punishmentId });

    if (!punishment) {
      return interaction.reply({
        content: 'No punishment found with the given ID for this user.',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('Punishment Removed')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Punishment with ID **${punishmentId}** for <@${user.id}> has been removed.`)
      .setFooter({ text: `Removed by: ${interaction.user.tag}` });

    interaction.reply({ embeds: [embed] });
  },
};
