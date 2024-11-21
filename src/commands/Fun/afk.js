const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const DB = require("../../models/AFKSystem");

module.exports = {
  name: 'afk',
  description: 'Set yourself away from keyboard!',
  options: [
    {
      name: 'set',
      description: 'Set your AFK status!',
      type: 1, // Subcommand type
      options: [
        {
          name: 'status',
          description: 'Set your status message!',
          type: 3, // String type
          required: true,
        },
      ],
    },
    {
      name: 'return',
      description: 'Return from being AFK!',
      type: 1, // Subcommand type
    },
  ],

  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const { guild, user, createdTimestamp, options } = interaction;
    
    const Response = new EmbedBuilder()
      .setTitle('💤 AFK System')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });

    try {
      switch (options.getSubcommand()) {
        case 'set': {
          const afkStatus = options.getString('status');

          // Обновляем или добавляем запись об AFK
          await DB.findOneAndUpdate(
            { GuildID: guild.id, UserID: user.id },
            { Status: afkStatus, Time: parseInt(createdTimestamp / 1000) },
            { new: true, upsert: true }
          );

          Response.setColor(client.color || '#0099ff').setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  Your AFK status has been updated to **${afkStatus}**.`);

          return interaction.reply({ embeds: [Response], ephemeral: true });
        }

        case 'return': {
          // Удаляем запись о AFK
          const afkData = await DB.findOne({ GuildID: guild.id, UserID: user.id });

          if (!afkData) {
            Response.setColor(embedColor).setDescription('<:freeiconcross391116:1288790867204898846>  | You are not currently AFK.');
            return interaction.reply({ embeds: [Response], ephemeral: true });
          }

          await DB.deleteOne({ GuildID: guild.id, UserID: user.id });

          Response.setColor(client.color || '#0099ff').setDescription(`<:freeiconcross391116:1288790867204898846>  | Your AFK status has been removed.`);

          return interaction.reply({ embeds: [Response], ephemeral: true });
        }
      }
    } catch (err) {
      console.error(err);

      // Отправляем сообщение об ошибке пользователю
      Response.setColor(embedColor).setDescription('<:freeiconcross391116:1288790867204898846>  | An error occurred while processing your AFK request. Please try again later.');
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }
  },
};
