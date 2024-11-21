const Clan = require('../../models/Clan');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'customize-clan',
  description: 'Customize your clan (for leaders only)',
  options: [
    {
      name: 'description',
      description: 'Set a new description for your clan',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'name',
      description: 'Change the name of your clan',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const newDescription = interaction.options.getString('description');
    const newName = interaction.options.getString('name');
    const userId = interaction.user.id;

    // Проверяем, является ли пользователь лидером клана
    const clan = await Clan.findOne({ leader: userId });
    if (!clan) {
      return interaction.reply({ content: 'You are not the leader of any clan!', ephemeral: true });
    }

    // Обновляем описание клана
    if (newDescription) {
      clan.description = newDescription;
    }

    // Проверяем, существует ли клан с новым именем, если лидер хочет поменять имя
    if (newName) {
      const existingClan = await Clan.findOne({ name: newName });
      if (existingClan) {
        return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | A clan with this name already exists!', ephemeral: true });
      }
      clan.name = newName;
    }

    // Сохраняем изменения
    await clan.save();

    const embed = new EmbedBuilder()
      .setTitle('Clan Updated')
      .setDescription(`Your clan **${clan.name}** has been updated.`)
      .addFields(
        { name: 'New Description', value: clan.description || 'No description set', inline: false },
        { name: 'New Name', value: clan.name, inline: true }
      )
      .setColor(embedColor)
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
