const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "add-time-giveaway",
    description: "Add more time to an ongoing giveaway.",
    options: [
        {
            name: "name",
            description: "The name of the giveaway to extend.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "additional-time",
            description: "Additional time to add (in minutes).",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const giveawayName = interaction.options.getString("name");
        const additionalTime = interaction.options.getNumber("additional-time");

        // Логика проверки активного розыгрыша
        const activeGiveaway = client.giveaways?.find(g => g.name === giveawayName);
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

        if (!activeGiveaway) {
            return interaction.reply({
                content: `❌ No active giveaway found with the name **${giveawayName}**.`,
                ephemeral: true,
            });
        }

        // Добавление времени к розыгрышу
        activeGiveaway.duration += additionalTime * 60 * 1000;

        const embed = new EmbedBuilder()
            .setTitle("⏳ Giveaway Extended")
            .setDescription(`The giveaway **${giveawayName}** has been extended by **${additionalTime} minutes**.`)
            .setColor(embedColor)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};
