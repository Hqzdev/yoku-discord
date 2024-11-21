const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'membercount',
    description: 'Send server\'s member count',

    callback: async (client, interaction) => {
        const UserSettings = require('../../models/UserSettings');
        const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
        const guild = interaction.guild;
        const memberCount = guild.memberCount; // Исправлено на правильное свойство

        const embed = new EmbedBuilder()
        .setColor(embedColor)
            .setTitle('<:level:1288145639963754586> |  Membercount')
            .setDescription(`We have ${memberCount} members!`)
            .setTimestamp(Date.now());

        await interaction.reply({ embeds: [embed] }); 
    },
};
