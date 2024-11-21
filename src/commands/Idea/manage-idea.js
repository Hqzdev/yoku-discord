const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');


module.exports = {
  name: 'manage-idea',
  description: 'Accept or reject an idea (moderators only)',
  devOnly: true,
  options: [
    {
      name: 'id',
      description: 'ID of the idea',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'action',
      description: 'Accept or reject the idea',
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: 'Accept', value: 'accepted' },
        { name: 'Reject', value: 'rejected' },
      ],
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | You do not have permission to use this command.', ephemeral: true });
    }

    const ideaId = interaction.options.getInteger('id');
    const action = interaction.options.getString('action');
    let found = false;

    // Проходим по всем идеям всех пользователей
    for (const [userId, userIdeas] of ideas.entries()) {
      for (const idea of userIdeas) {
        if (idea.id === ideaId) {
          idea.status = action === 'accepted' ? 'Accepted' : 'Rejected';
          found = true;

          const embed = new EmbedBuilder()
          .setColor(embedColor)
            .setDescription(`Idea ID: **${idea.id}** has been **${idea.status}**.`);

          interaction.reply({ embeds: [embed], ephemeral: true });

          // Отправляем пользователю уведомление о статусе его идеи
          const user = await client.users.fetch(userId);
          user.send(`Your idea (ID: **${idea.id}**) has been **${idea.status}** by the moderators.`);

          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return interaction.reply({ content: `No idea found with ID: ${ideaId}`, ephemeral: true });
    }
  },
};
