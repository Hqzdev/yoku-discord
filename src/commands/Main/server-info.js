const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Embed, ChannelType } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Information about the server!',

    callback: async (client, interaction) => {
        const UserSettings = require('../../models/UserSettings');
        const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
        const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
        const { guild } = interaction;

        const Embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({name: guild.name, iconURL: guild.iconURL()})
        .setThumbnail(guild.iconURL())
        .setTimestamp(Date.now())
        .addFields([
        { name: "<:freeiconhomepage3858444:1288483844181459047> │ GENERAL", 
          value: 
          `
          <:freeiconaddtask14820466:1289526097070915595> Name: ${guild.name}
          <:freeicondailyroutine14991730:1288480944172306486> Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>
          <:freeiconcrown2350683:1288483884882722826> Owner: <@${guild.ownerId}>

          <:freeiconaddtask14820466:1289526097070915595> Description: ${guild.description || "None"}    
          ` 
        },
        {
            name: "<:freeiconteam14820571:1289526156315332702> │ CHANNELS ",
            value:
            `
            <:freeiconlaugh2058208:1288483867111456798> Text: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size}
            <:freeiconstreamer15356715:1288469676526927925> Voice: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size}
            <:freeiconinteractivesession149315:1289526191815917622> Threads: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildPublicThread && ChannelType.GuildPrivateThread && ChannelType.GuildNewsThread).size}
            <:freeiconworker14820477:1289525953726517321> Categories: ${guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildCategory).size}

            <:freeiconcommunityengagement14931:1289526387782189091> Total: ${guild.channels.cache.size}
            `
        },
        {
            name: "<:freeiconpremiumaccount15356705:1288470104924754022> | EMOJIS & STICKERS",
            value:
            `
            <:emoji_143:1289106549838712946> Animated: ${guild.emojis.cache.filter((emoji) => emoji.animated).size}
            <:emoji_144:1289106597683003424> Static: ${guild.emojis.cache.filter((emoji) => !emoji.animated).size}
            <:freeiconhybridwork14820393:1289526036911882272> Stickers: ${guild.stickers.cache.size}

            <:freeiconcommunityengagement14931:1289526387782189091> Total: ${guild.emojis.cache.size + guild.stickers.cache.size}
            `
        }
        ])

        await interaction.reply({embeds: [Embed]})
    }
}