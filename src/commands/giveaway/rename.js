const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "rename-giveaway",
    description: "Rename an ongoing giveaway.",
    options: [
        {
            name: "old-name",
            description: "The current name of the giveaway.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "new-name",
            description: "The new name for the giveaway.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const oldName = interaction.options.getString('old-name');
        const newName = interaction.options.getString('new-name');

        const activeGiveaway = client.giveaways?.find(g => g.name === oldName);
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

        if (!activeGiveaway) {
            return interaction.reply({
                content: `❌ No active giveaway found with the name **${oldName}**.`,
                ephemeral: true,
            });
        }



        activeGiveaway.name = newName;

        const embed = new EmbedBuilder()
        .setTitle("✏️ Giveaway Renamed")
        .setDescription(`The giveaway **${oldName}** has been renamed to **${newName}**.`)
        .setColor(embedColor)
        .setTimestamp();

    interaction.reply({ embeds: [embed] });
},
};