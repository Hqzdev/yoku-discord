const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const UserSettings = require('../../models/UserSettings');

module.exports = {
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
        .setDescription('You can only run this command inside a server.');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const guildId = interaction.guild.id;
    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply();

    // Ищем пользователя в базе данных
    let user = await User.findOne({ userId: targetUserId, guildId });

    // Если пользователя нет в базе данных, создаем профиль
    if (!user) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setDescription(`<@${interaction.member.id}> doesn't have a profile yet.`);

      interaction.editReply({ embeds: [embed] });
      return;
    }

    const member = interaction.options.getUser('user') || interaction.user;

    // Создаем Embed для ответа
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`Balance of ${member.username}`)
      .setDescription(
        `\n > Money: **${user.default}** <:freeiconmoneybag3141962:1288482986651680778> \n  > Premium money: **${user.premium}** <:freeicondollar1538306:1288482964757282882>`
      )
      .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 1024 })) // Устанавливаем аватар пользователя
      .setTimestamp();

    interaction.editReply({ embeds: [embed], ephemeral: true });
  },

  name: 'balance',
  description: "See yours/someone else's balance",
  options: [
    {
      name: 'user',
      description: 'The user whose balance you want to get.',
      type: ApplicationCommandOptionType.User,
    },
  ],
};
