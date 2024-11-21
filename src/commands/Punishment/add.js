const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Punishment = require('../../models/Punishment');

module.exports = {
  name: 'add-punishment',
  description: 'Add a punishment to a user',
  options: [
    {
      name: 'user',
      description: 'The user you want to punish',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'type',
      description: 'Type of punishment (ban, kick, warn, etc.)',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Ban', value: 'ban' },
        { name: 'Kick', value: 'kick' },
        { name: 'Warn', value: 'warn' },
      ],
    },
    {
      name: 'reason',
      description: 'The reason for the punishment',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const type = interaction.options.getString('type');
    const reason = interaction.options.getString('reason');
    const guildId = interaction.guild.id;
    const userId = user.id;
    const issuedBy = interaction.user.id;

    // Создаем запись о наказании в базе данных
    const punishment = new Punishment({
      guildId,
      userId,
      punishmentType: type,
      reason,
      issuedBy,
    });

    await punishment.save(); // Сохраняем наказание в базе данных

    const embed = new EmbedBuilder()
      .setColor('#303135')
      .setTitle('Punishment Issued')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | <@${userId}> has been **${type}**. Reason: ${reason}.`)
      .setFooter({ text: `Issued by: ${interaction.user.tag}` });

    interaction.reply({ embeds: [embed] });
  },
};
