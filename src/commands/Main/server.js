const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Information about the server!',

    callback: async (client, interaction) => {
        const UserSettings = require('../../models/UserSettings');
        const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
        const { guild } = interaction;

        // Создаем Embed
        const serverInfoEmbed = new EmbedBuilder()
        .setColor(embedColor)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setThumbnail(guild.iconURL())
            .setTimestamp(Date.now())
            .addFields([
                { 
                    name: "💬 │ GENERAL", 
                    value: 
                    `
                    🪧 Name: ${guild.name}
                    🕰️ Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
                    👑 Owner: <@${guild.ownerId}>
                    📃 Description: ${guild.description || "None"}
                    `,
                },
                {
                    name: "📱 │ CHANNELS",
                    value: 
                    `
                    📝 Text: ${guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size}
                    🔊 Voice: ${guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size}
                    📜 Threads: ${guild.channels.cache.filter(channel => 
                        channel.type === ChannelType.GuildPublicThread || 
                        channel.type === ChannelType.GuildPrivateThread || 
                        channel.type === ChannelType.GuildNewsThread
                    ).size}
                    📇 Categories: ${guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size}
                    🎁 Total: ${guild.channels.cache.size}
                    `,
                },
                {
                    name: "😀 | EMOJIS & STICKERS",
                    value: 
                    `
                    🎞️ Animated: ${guild.emojis.cache.filter(emoji => emoji.animated).size}
                    🖇️ Static: ${guild.emojis.cache.filter(emoji => !emoji.animated).size}
                    💗 Stickers: ${guild.stickers.cache.size}
                    😮 Total: ${guild.emojis.cache.size + guild.stickers.cache.size}
                    `,
                }
            ]);

        await interaction.reply({ embeds: [serverInfoEmbed] });
    }
};
