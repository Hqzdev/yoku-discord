const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Идентификатор пользователя
  },
  guildId: {
    type: String,
    required: true, // Идентификатор сервера (гильдии)
  },
  systemColor: {
    type: String,
    default: '#303135', // Цвет системных сообщений по умолчанию
  },
  dailyBonus: {
    type: Number,
    default: 100, // Ежедневный бонус по умолчанию
  },
  roleMultiplier: {
    type: Number,
    default: 1.0, // Множитель для ролей
  },
  conversionRate: {
    type: Number,
    default: 1.0, // Курс конвертации валюты
  },
  // Можно добавить другие настройки, если нужно
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
