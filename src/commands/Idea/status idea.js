const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'idea_status',
  description: 'Check the status of your ideas',
  options: [
    {
      name: 'id',
      description: 'ID of the idea',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const userId = interaction.user.id;
    const ideaId = interaction.options.getInteger('id');

    if (!ideas.has(userId)) {
      return interaction.reply({ content: 'You have not submitted any ideas yet.', ephemeral: true });
    }

    const userIdeas = ideas.get(userId);
    const foundIdea = userIdeas.find(idea => idea.id === ideaId);

    if (!foundIdea) {
      return interaction.reply({ content: `No idea found with ID: ${ideaId}`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setDescription(`Your idea (ID: **${foundIdea.id}**) is **${foundIdea.status}**.`);

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
