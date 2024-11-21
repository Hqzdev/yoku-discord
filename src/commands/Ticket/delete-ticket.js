const { SlashCommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
    name: 'ticket-close',
    description: 'Close the current ticket',
    callback: async (client, interaction) => {
    const ticketChannel = interaction.channel;

    // Check if the channel is a ticket channel
    if (!ticketChannel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846> | This command can only be used in a ticket channel.', ephemeral: true });
    }

    await interaction.reply({ content: '<:freeiconhybridwork14820393:1289526036911882272> | Are you sure you want to close this ticket? Reply with "yes" to confirm.', ephemeral: true });

    // Create a message collector to confirm closure
    const filter = m => m.author.id === interaction.user.id && m.content.toLowerCase() === 'yes';
    const collector = ticketChannel.createMessageCollector({ filter, time: 15000 });

    collector.on('collect', async () => {
      await interaction.followUp({ content: '<:freeiconcheckbox1168610:1288790836712308779> | Ticket will be closed and the channel will be deleted.' });
      
      // Archive the ticket and delete the channel after a short delay
      setTimeout(() => {
        ticketChannel.delete().catch(console.error);
      }, 5000);
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ content: 'Ticket closure timed out. No action was taken.', ephemeral: true });
      }
    });
  },
};
