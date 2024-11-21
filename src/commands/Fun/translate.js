const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const translate = require("@iamtraction/google-translate");

module.exports = {
    name: 'translate',
    description: 'Translate any text to a specific language!',
    options: [
        {
            name: 'text',
            description: 'The text you want to translate!',
            type: ApplicationCommandOptionType.String, // Тип String для текста
            required: true,
        },
        {
            name: 'language',
            description: 'The language you want to translate to!',
            type: ApplicationCommandOptionType.String, // Тип String для языка
            required: true,
            choices: [
                { name: "English", value: "en" },
                { name: "German", value: "de" },
                { name: "French", value: "fr" },
                { name: "Russian", value: "ru" },
                { name: "Portuguese", value: "pt" },
                { name: "Turkish", value: "tr" },
                { name: "Japanese", value: "ja" },
                { name: "Greek", value: "el" },
            ],
        },
    ],

    callback: async (client, interaction) => {
        const UserSettings = require('../../models/UserSettings');
        const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
        const { options } = interaction;
        const text = options.getString('text');
        const language = options.getString('language');

        try {
            // Используем API для перевода
            const translated = await translate(text, { to: language });

            // Отправляем ответ с переводом
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('🌍 Translator')
                .addFields(
                    { name: 'Language', value: language, inline: false },
                    { name: 'Original Message:', value: text, inline: true },
                    { name: 'Translated:', value: translated.text, inline: true }
                )
                .setFooter({ text: `Requested by ${interaction.member.user.tag}`, iconURL: interaction.member.user.displayAvatarURL() });

            // Используем reply для отправки перевода
            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error('Translation error:', error);
            await interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | An error occurred while translating the text. Please try again later.', ephemeral: true });
        }
    }
};
