const { SlashCommandBuilder, EmbedBuilder, ApplicationCommand, ApplicationCommandOptionType } = require('discord.js');
const Reminder = require('../../models/Reminder');

module.exports = {
    name: 'remind',
    description: "Set a reminder",
    premium: true,
    options: [
      {
        name: 'message',
        description: 'The reminder message',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'time',
        description: 'Reminder time in minutes',
        required: true,
        type: 10,
      },
    ],
    callback: async (client, interaction) => {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;
    const reminderMessage = interaction.options.getString('message');
    const timeInMinutes = interaction.options.getInteger('time');

    const reminderTime = new Date();
    reminderTime.setMinutes(reminderTime.getMinutes() + timeInMinutes);

    // Сохраняем напоминание в базу данных
    const reminder = new Reminder({
      userId,
      guildId,
      channelId,
      reminder: reminderMessage,
      time: reminderTime,
    });

    await reminder.save();

    // Подтверждаем установку напоминания
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('Reminder Set!')
      .setDescription(`I will remind you in ${timeInMinutes} minutes.`)
      .addFields({ name: 'Reminder:', value: reminderMessage })
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });

    // Таймер для отправки напоминания (запуск в реальном времени)
    setTimeout(async () => {
      const channel = await interaction.client.channels.fetch(channelId);
      if (!channel) return;

      channel.send(`<@${userId}> ⏰ Here is your reminder: **${reminderMessage}**`);

      // Удаляем напоминание после отправки
      await Reminder.findByIdAndDelete(reminder._id);
    }, timeInMinutes * 60 * 1000);
  },
};
