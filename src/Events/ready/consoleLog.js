const { ActivityType } = require('discord.js');
module.exports = (client) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

// Массив с активностями для смены
const activities = [
  { name: 'with code', type: ActivityType.Playing },
  { name: 'some music', type: ActivityType.Listening },
  { name: 'over the server', type: ActivityType.Watching },
  { name: 'with AI', type: ActivityType.Playing },
  { name: 'your messages', type: ActivityType.Listening }
];

// Интервал в миллисекундах для смены активности (например, каждые 30 секунд)
const activityInterval = 30 * 1000;



    // Функция для смены активности
    const changeActivity = () => {
      const randomIndex = Math.floor(Math.random() * activities.length); // Выбираем случайную активность
      const activity = activities[randomIndex];

      // Устанавливаем активность бота
      client.user.setActivity(activity.name, { type: activity.type });

      console.log(`Bot activity set to: ${activity.name}`);
    };

    // Начальная установка активности
    changeActivity();

    // Установка интервала для смены активности
    setInterval(changeActivity, activityInterval);
  });
};
