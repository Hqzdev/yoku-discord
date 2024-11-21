const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'leave',
  description: 'Leave the voice channel',
  callback: async (client, interaction) => {
    const connection = getVoiceConnection(interaction.guild.id);

    if (connection) {
      connection.destroy();
      interaction.reply('<:freeiconcheckbox1168610:1288790836712308779> |  Left the voice channel.');
    } else {
      interaction.reply('<:freeiconcross391116:1288790867204898846>  | I am not in a voice channel.');
    }
  },
};
