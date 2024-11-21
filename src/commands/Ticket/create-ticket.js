const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
    name: 'support',
    description: 'Create s support ticket',

    callback: async (client, interaction) => {
    const guild = interaction.guild;
    const member = interaction.member;
    const ticketCategory = '1010977945902403594'; 

    // Check if the user already has a ticket open
    const existingChannel = guild.channels.cache.find(c => c.name === `ticket-${member.user.username.toLowerCase()}`);
    if (existingChannel) {
      const embed = new EmbedBuilder()
        .setDescription('<:freeiconinteractivesession149315:1289526191815917622> | You already have an open ticket!')
        .setColor('#303135') 
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Create a new channel for the ticket
    const ticketChannel = await guild.channels.create({
      name: `ticket-${member.user.username}`,
      type: 0, // 0 represents a text channel in Discord.js v14
      parent: ticketCategory,
      permissionOverwrites: [
        {
          id: guild.id, // Deny access to everyone
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: member.id, // Allow the ticket creator to view and send messages
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: '1011149306209771570', // Replace with the ID of the support role
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
      ],
    });

    // Embed to confirm ticket creation in the ticket channel
    const embed = new EmbedBuilder()
      .setDescription('<:freeiconcheckbox1168610:1288790836712308779> | A staff member will assist you shortly.')
      .setColor('#303135') // Green for success
      .setTimestamp();

    // Embed for the reply when the ticket is created
    const replyEmbed = new EmbedBuilder()
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Your ticket has been created in ${ticketChannel}.`)
      .setColor('#303135') // Green for success
      .setTimestamp();

    // Reply to the interaction with an ephemeral embed
    await interaction.reply({ embeds: [replyEmbed], ephemeral: true });

    // Send a message to the ticket channel with the embed
    await ticketChannel.send({ content: `<:freeiconstreamer15356715:1288469676526927925> | ${member}, welcome to your support ticket!`, embeds: [embed] });
  },
};
