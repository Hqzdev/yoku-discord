const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { userReports } = require('../Report/report'); 

module.exports = {
    name: 'reset-report',
    description: 'Reset user\'s reports',
    devOnly: true,
    disabled: true,
    options: [
        {
            name: 'member',
            description: 'User whose reports you want to reset',
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],

    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('member');

        // Проверка наличия репортов у пользователя
        if (userReports.has(targetUser.id)) {
            // Удаление всех репортов
            userReports.delete(targetUser.id);

            const resetEmbed = new EmbedBuilder()
                .setTitle('Reports Reset')
                .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  **${targetUser.username}'s** reports have been successfully reset.`)
                .setColor('#303135');

            return interaction.reply({ embeds: [resetEmbed] });
        } else {
            // Если у пользователя нет репортов
            const noReportsEmbed = new EmbedBuilder()
                .setTitle('No Reports Found')
                .setDescription(`<:freeiconcross391116:1288790867204898846>  | **${targetUser.username}** has no reports to reset.`)
                .setColor('#303135');

            return interaction.reply({ embeds: [noReportsEmbed], ephemeral: true });
        }
    }
};
