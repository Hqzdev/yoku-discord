const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const userReports = new Map();

module.exports = {
    userReports,
    name: 'report',
    description: 'Report other member',
    options: [
        {
            name: 'member',
            description: 'The user you want to write a report on',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'Write a reason',
            type: ApplicationCommandOptionType.String,
            required: false    
        },
    ],
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('member');
        const guildMember = interaction.guild.members.cache.get(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 

        if (!guildMember) {
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('<:20943crossmark:1268557997349797899> | The user **is not found** on the server.')
                .setColor(embedColor)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let reports = userReports.get(targetUser.id) || 0;

        reports += 1;
        userReports.set(targetUser.id, reports);

        // Удаление репорта через неделю (7 дней)
        setTimeout(() => {
            if (userReports.has(targetUser.id)) {
                const currentReports = userReports.get(targetUser.id);
                if (currentReports > 0) {
                    userReports.set(targetUser.id, currentReports - 1);
                }

                if (userReports.get(targetUser.id) === 0) {
                    userReports.delete(targetUser.id);
                }
            }
        }, 7 * 24 * 60 * 60 * 1000); // 7 дней в миллисекундах

        if (reports >= 3) {
            await guildMember.ban({ reason: `The user received **3** reports. Reason: **${reason}**` });
            userReports.delete(targetUser.id); 

            const banEmbed = new EmbedBuilder()
                .setTitle('User blocked')
                .setDescription(`<:37667checkmark:1268558027364106416> | **${targetUser.username}** received **3** reports and was blocked.\nReason: ${reason}`)
                .setColor(embedColor)
            return interaction.reply({ embeds: [banEmbed] });
        } else {
            const reportEmbed = new EmbedBuilder()
                .setTitle('Report send')
                .setDescription(`<:level:1288145639963754586> | **${targetUser.username}** received **${reports}** report(s)\nReason: **${reason}**`)
                .setColor(embedColor)
            return interaction.reply({ embeds: [reportEmbed] });
        }
    }
};
