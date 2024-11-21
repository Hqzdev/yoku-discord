const weather = require('weather-js')
const { Client, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: 'weather',
    description: 'Get the current weather from any location',
    options: [
      {
        name: 'location',
        description: 'A Cityname or a Country',
        type: ApplicationCommandOptionType.String, // Исправлено на строку
        required: true,
      },
    ],
    callback: async (client, interaction) => {
      const UserSettings = require('../../models/UserSettings');
      const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
      const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
        const { options } = interaction; 
        
        const location = options.getString('location');

        weather.find({ search: location, degreeType: 'C' }, (err, result) => {
            if(err) throw err;
            if(result === undefined || result.length === 0) return interaction.reply({ content: '**INVALID LOCATION**', ephemeral: true });

            var current = result[0].current;
            var loc = result[0].location;

            const weatherinfo = new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(`**${current.skytext}**`)
            .setAuthor({name: `Weather forecast for ${current.observationpoint}`})
            .setThumbnail(current.imageUrl)
            .addFields([
                { name: 'Timezone', value: `UTC${loc.timezone}`, inline: true },
                { name: 'Degree Type', value: 'Celsius', inline: true },
                { name: 'Temperature', value: `${current.temperature}°C`, inline: true },
                { name: 'Wind', value: `${current.winddisplay}`, inline: true },
                { name: 'Feels like', value: `${current.feelslike}`, inline: true },
                { name: 'Humidity', value: `${current.humidity}%`, inline: true }
            ])
            .setTimestamp(Date.now())

            return interaction.reply({ embeds: [weatherinfo]});
        })
    }
}