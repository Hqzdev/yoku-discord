const Clan = require('../../models/Clan'); // Модель клана
const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const UserSettings = require('../../models/UserSettings'); 

module.exports = {
  name: 'create-clan',
  description: 'Create a new clan (5000 def coin)',
  options: [
    {
      name: 'name',
      description: 'Name of your clan',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'description',
      description: 'A description of your clan',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const clanName = interaction.options.getString('name');
    const description = interaction.options.getString('description') || '';
    const userId = interaction.user.id;

    // Проверяем, не состоит ли пользователь уже в каком-то клане
    const existingClan = await Clan.findOne({ members: userId });
    if (existingClan) {
      return interaction.reply({ content: 'You are already in a clan!', ephemeral: true });
    }

    // Проверяем, не существует ли клан с таким именем
    const existingClanByName = await Clan.findOne({ name: clanName });
    if (existingClanByName) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | A clan with this name already exists!', ephemeral: true });
    }

    // Создаем новый клан
    const newClan = new Clan({
      name: clanName,
      leader: userId,
      members: [userId],
      description,
    });
    await newClan.save();
    user.default -= 5000;
    const embed = new EmbedBuilder()
      .setTitle('Clan Created!')
      .setDescription(`Clan **${clanName}** has been created.`)
      .addFields(
        { name: 'Leader', value: `<@${userId}>`, inline: true },
        { name: 'Description', value: description || 'No description provided', inline: false }
      )
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
