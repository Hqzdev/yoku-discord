const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('<:freeiconcross391116:1288790867204898846>  | You can only run this command inside a server.');
      return;
    }

    const targetRoleId = interaction.options.get('role').value;

    try {
      await interaction.deferReply();

      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        if (autoRole.roleId === targetRoleId) {
          interaction.editReply('<:freeiconefficiency14991726:1288471655290634322> | Auto role has already been configured for that role. To disable run `/autorole-disable`');
          return;
        }

        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        });
      }

      await autoRole.save();
      interaction.editReply('<:freeiconefficiency14991726:1288471655290634322> | Autorole has now been configured. To disable run `/autorole-disable`');
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-configure',
  description: 'Configure your auto-role for this server.',
  options: [
    {
      name: 'role',
      description: 'The role you want users to get on join.',
      devOnly: true,
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};