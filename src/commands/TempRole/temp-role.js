const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const TempRole = require('../../models/TempRole');

module.exports = {
  name: 'temp-role',
  description: 'Assign a temporary role to a user',
  options: [
    {
      name: 'user',
      description: 'The user you want to assign the role to',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'role',
      description: 'The role you want to assign temporarily',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: 'duration',
      description: 'The duration of the role in minutes',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const duration = interaction.options.getInteger('duration');
    const expirationTime = new Date(Date.now() + duration * 60 * 1000); // вычисляем время окончания роли

    // Добавляем роль пользователю
    const guildMember = await interaction.guild.members.fetch(user.id);
    await guildMember.roles.add(role);

    // Сохраняем временную роль в базе данных
    const tempRole = new TempRole({
      guildId: interaction.guild.id,
      userId: user.id,
      roleId: role.id,
      expirationTime: expirationTime,
    });
    await tempRole.save();

    const embed = new EmbedBuilder()
    .setColor('#303135')
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Temporary role **${role.name}** assigned to ${user.username} for ${duration} minutes.`);
    interaction.reply({ embeds: [embed] });

    // Устанавливаем таймер для удаления роли после истечения времени
    setTimeout(async () => {
      await guildMember.roles.remove(role);
      await TempRole.deleteOne({ guildId: interaction.guild.id, userId: user.id, roleId: role.id });
    }, duration * 60 * 1000);
  },
};
