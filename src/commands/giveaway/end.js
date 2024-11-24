const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "end-giveaway",
    description: "Manually end an ongoing giveaway.",
    options: [
        {
            name: "name",
            description: "The name of the giveaway to end.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const giveawayName = interaction.options.getString("name");

        // Логика проверки активного розыгрыша
        // (Должно быть реализовано на основе вашей системы хранения данных розыгрышей)
        // Например:
        const activeGiveaway = client.giveaways?.find(g => g.name === giveawayName);
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

        if (!activeGiveaway) {
            return interaction.reply({
                content: `❌ No active giveaway found with the name **${giveawayName}**.`,
                ephemeral: true,
            });
        }

        // Удаление розыгрыша из активных
        client.giveaways = client.giveaways.filter(g => g.name !== giveawayName);

        // Отправляем сообщение о завершении
        const embed = new EmbedBuilder()
            .setTitle("🎉 Giveaway Ended!")
            .setDescription(`The giveaway **${giveawayName}** has been manually ended.`)
            .setColor(embedColor)
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};
