const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BanPool = require('../../models/Banpool');

const UserSettings = require('../../models/UserSettings'); 

module.exports = {
  name: 'banpool-manage',
  description: 'Manage an existing ban pool.',
  options: [
    {
      name: 'action',
      description: 'Add or remove a server or manage bans.',
      type: 3, // STRING
      required: true,
      choices: [
        { name: 'add-server', value: 'add-server' },
        { name: 'remove-server', value: 'remove-server' },
        { name: 'add-ban', value: 'add-ban' },
        { name: 'remove-ban', value: 'remove-ban' },
      ],
    },
    {
      name: 'pool-name',
      description: 'The name of the ban pool.',
      type: 3,
      required: true,
    },
    {
      name: 'server-id',
      description: 'Server ID for server management (optional for ban management).',
      type: 3,
      required: false,
    },
    {
      name: 'user-id',
      description: 'User ID for ban management (optional for server management).',
      type: 3,
      required: false,
    },
    {
      name: 'reason',
      description: 'Reason for banning (only for add-ban).',
      type: 3,
      required: false,
    },
  ],

  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const action = interaction.options.getString('action');
    const poolName = interaction.options.getString('pool-name');
    const serverId = interaction.options.getString('server-id');
    const userId = interaction.options.getString('user-id');
    const reason = interaction.options.getString('reason');
    const guildId = interaction.guild.id;

    const pool = await BanPool.findOne({ poolName, guildId });
    if (!pool) {
      return interaction.reply({ content: 'Ban pool not found.', ephemeral: true });
    }

    let embed = new EmbedBuilder().setColor('#303135');

    switch (action) {
      case 'add-server':
        if (serverId && !pool.servers.includes(serverId)) {
          pool.servers.push(serverId);
          await pool.save();
          embed.setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Server **${serverId}** has been added to ban pool **${poolName}**.`);
        } else {
          embed.setDescription('<:freeiconcross391116:1288790867204898846> | Server already exists in the pool or server ID is missing.');
        }
        break;

      case 'remove-server':
        if (serverId && pool.servers.includes(serverId)) {
          pool.servers = pool.servers.filter(id => id !== serverId);
          await pool.save();
          embed.setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Server **${serverId}** has been removed from ban pool **${poolName}**.`);
        } else {
          embed.setDescription('<:freeiconcross391116:1288790867204898846> | Server does not exist in the pool or server ID is missing.');
        }
        break;

      case 'add-ban':
        if (userId && !pool.bannedUsers.some(user => user.userId === userId)) {
          pool.bannedUsers.push({ userId, reason: reason || 'No reason provided' });
          await pool.save();
          embed.setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | User **${userId}** has been banned in ban pool **${poolName}**.`);
        } else {
          embed.setDescription('<:freeiconcross391116:1288790867204898846> | User already banned or user ID is missing.');
        }
        break;

      case 'remove-ban':
        if (userId && pool.bannedUsers.some(user => user.userId === userId)) {
          pool.bannedUsers = pool.bannedUsers.filter(user => user.userId !== userId);
          await pool.save();
          embed.setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | User **${userId}** has been unbanned in ban pool **${poolName}**.`);
        } else {
          embed.setDescription('<:freeiconcross391116:1288790867204898846> | User not found in the ban pool or user ID is missing.');
        }
        break;

      default:
        embed.setDescription('Invalid action.');
    }

    interaction.reply({ embeds: [embed] });
  },
};
