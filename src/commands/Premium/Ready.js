const Reminder = require('../../models/Reminder');

module.exports = {
  name: 'ready',
  description: 'restart bot',
  premium: true,
  once: true,
  callback: async (client, interaction) => {

    // Найти все активные напоминания
    const reminders = await Reminder.find();

    for (const reminder of reminders) {
      const currentTime = new Date();
      const remainingTime = new Date(reminder.time) - currentTime;

      if (remainingTime > 0) {
        // Заново установить таймер для каждого напоминания
        setTimeout(async () => {
          const channel = await client.channels.fetch(reminder.channelId);
          if (channel) {
            channel.send(`<@${reminder.userId}> ⏰ Here is your reminder: **${reminder.reminder}**`);
            await Reminder.findByIdAndDelete(reminder._id); // Удалить напоминание после отправки
          }
        }, remainingTime);
      } else {
        // Если время истекло, отправить сразу
        const channel = await client.channels.fetch(reminder.channelId);
        if (channel) {
          channel.send(`<@${reminder.userId}> ⏰ Here is your reminder: **${reminder.reminder}**`);
          await Reminder.findByIdAndDelete(reminder._id);
        }
      }
    }
  },
};
