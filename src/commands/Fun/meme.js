const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const randomPuppy = require('random-puppy');

module.exports = {
  name: 'meme',
  description: 'Send an epic meme.',
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    try {
      const subReddits = ["dankmeme", "meme", "me_irl"];
      const random = subReddits[Math.floor(Math.random() * subReddits.length)];

      // Получаем картинку из случайного субреддита
      const img = await randomPuppy(random);

      // Создаем Embed с мемом
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`From [${random}](https://reddit.com/r/${random})`)
        .setTitle("🎭 Meme")
        .setImage(img)
        .setTimestamp(Date.now());

      // Отправляем сообщение
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching meme:', error);
      await interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | Failed to fetch a meme. Please try again later!', ephemeral: true });
    }
  }
};
