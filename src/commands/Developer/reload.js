const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'reload',
  description: 'Reload all commands and events',
  devOnly: true,
  options: [
    {
      name: 'type',
      description: 'Choose what to reload: commands or events',
      type: 3, // String
      required: true,
      choices: [
        { name: 'Commands', value: 'commands' },
        { name: 'Events', value: 'events' },
      ],
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const choice = interaction.options.getString('type');

    try {
      if (choice === 'commands') {
        // Удаляем команды из кеша
        client.commands.sweep(() => true);

        // Загружаем команды
        const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));
        for (const folder of commandFolders) {
          const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));
          for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
          }
        }

        await interaction.reply({ content: '✅ Commands reloaded successfully!', ephemeral: true });
      } else if (choice === 'events') {
        // Удаляем все зарегистрированные события
        client.removeAllListeners();

        // Загружаем ивенты
        const eventFiles = fs.readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
          const event = require(`../events/${file}`);
          if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
          } else {
            client.on(event.name, (...args) => event.execute(...args, client));
          }
        }

        await interaction.reply({ content: '✅ Events reloaded successfully!', ephemeral: true });
      }
    } catch (error) {
      console.error('Error while reloading:', error);
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setTitle('❌ Error')
        .setDescription(`There was an error trying to reload the ${choice}: ${error.message}`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
