const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { userReports } = require('./report'); // Импортируем хранилище репортов

module.exports = {
    name: 'my-report',
    description: 'Check how many reports a member has and when they will be removed',
    options: [
        {
            name: 'member',
            description: 'The user you want to check reports on',
            type: ApplicationCommandOptionType.User,
            required: true
        },
    ],
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('member');
        const guildMember = interaction.guild.members.cache.get(targetUser.id);

        if (!guildMember) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('<:20943crossmark:1268557997349797899> | The user **is not found** on the server.')
                .setColor('#303135');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Проверяем, есть ли отчеты для данного пользователя
        const reportData = userReports.get(targetUser.id);

        if (!reportData || !reportData.reports || reportData.reports.length === 0) {
            const noReportsEmbed = new EmbedBuilder()
                .setTitle('No Reports')
                .setDescription(`<:level:1288145639963754586> | **${targetUser.username}** has no active reports.`)
                .setColor('#303135');

            return interaction.reply({ embeds: [noReportsEmbed], ephemeral: true });
        }

        // Создаем список репортов и времени до их удаления
        let reportDescriptions = reportData.reports.map((report, index) => {
            const timeLeft = Math.max(0, (report.timestamp + (7 * 24 * 60 * 60 * 1000)) - Date.now());
            const daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
            const hoursLeft = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

            return `Report ${index + 1}: Added for reason: **${report.reason}**\nWill be removed in: **${daysLeft}d ${hoursLeft}h**`;
        }).join('\n\n');

        const reportEmbed = new EmbedBuilder()
            .setTitle('Check Reports')
            .setDescription(`<:level:1288145639963754586> | **${targetUser.username}** has **${reports}** report(s).\n\n${reportDescriptions}`)
            .setColor('#303135');

        return interaction.reply({ embeds: [reportEmbed] });
    }
};
