const mongoose = require('mongoose');

const EconomySettingsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  dailyBonus: {
    type: Number,
    default: 100, // Значение по умолчанию для дневного бонуса
  },
  multiplierRoles: {
    type: Map,
    of: Number, // Это карта, где ключ — ID роли, а значение — множитель
    default: {},
  },
  conversionRate: {
    type: Number,
    default: 1, // Курс конвертации по умолчанию
  }
});

module.exports = mongoose.model('EconomySettings', EconomySettingsSchema);
