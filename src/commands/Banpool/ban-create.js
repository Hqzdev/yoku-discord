const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BanPool = require('../../models/Banpool');
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'banpool-create',
  description: 'Create a new ban pool.',
  options: [
    {
      name: 'name',
      description: 'The name of the ban pool.',
      type: 3, // STRING
      required: true,
    },
  ],
  
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    const poolName = interaction.options.getString('name');
    const guildId = interaction.guild.id;

    // Проверяем, существует ли уже банпул с таким именем
    const existingPool = await BanPool.findOne({ poolName, guildId });
    if (existingPool) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846> | A ban pool with this name already exists!', ephemeral: true });
    }

    // Создаём новый банпул
    const newBanPool = new BanPool({
      guildId,
      poolName,
      servers: [guildId], // Сервер создателя добавляется в пул
    });

    await newBanPool.save();

    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setTitle('<:freeiconcheckbox1168610:1288790836712308779> | Ban Pool Created')
      .setDescription(`Ban pool **${poolName}** has been created!`);

    interaction.reply({ embeds: [embed] });
  },
};
