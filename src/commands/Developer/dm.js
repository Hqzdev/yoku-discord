const { Client, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'dm',
  description: 'Direct Message a Server Member!',
  devOnly: true,
  options: [
    {
      name: 'user',
      description: 'The user you want to message.',
      required: true,
      type: ApplicationCommandOptionType.User, 
    },
    {
      name: 'message',
      description: 'The message you want to send.',
      required: true,
      type: ApplicationCommandOptionType.String, // Заменено на ApplicationCommandOptionType.String для ясности
    },
  ],

  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    // Получаем опции
    const user = interaction.options.getMember('user');
    const message = interaction.options.getString('message');
    const member = interaction.member;

    // Проверка на то, что пользователь не бот
    if (user.user.bot) {
      return interaction.reply({ content: '<:freeiconcross391116:1288790867204898846>  | You cannot send a DM to a bot!', ephemeral: true });
    }

    // Создаем Embed для отправки в ЛС
    const embed = new EmbedBuilder()
      .setTitle("<:emoji_145:1289106625730449408> | You've got a new Message")
      .setFooter({ text: `From ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
      .setDescription(`**Message:** \n${message}`)
      .setTimestamp(Date.now())
      .setColor(embedColor) // Используем цвет клиента или дефолтный цвет

    try {
      // Отправляем сообщение в ЛС
      await user.send({ embeds: [embed] });
      // Подтверждаем успешную отправку
      await interaction.reply({ content: `<:freeiconcheckbox1168610:1288790836712308779> |  Successfully sent message to ${user.user.tag}!`, ephemeral: true });
    } catch (error) {
      console.error(`Could not send DM to ${user.user.tag}:`, error);
      await interaction.reply({ content: `<:freeiconcross391116:1288790867204898846>  | Failed to send message. The user may have DMs disabled.`, ephemeral: true });
    }
  },
};
