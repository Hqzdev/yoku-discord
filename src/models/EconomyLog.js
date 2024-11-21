const mongoose = require('mongoose');

const economyLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true }, // Тип: add, transfer, remove
  amount: { type: Number, required: true },
  targetUserId: { type: String }, // Целевой пользователь (если есть)
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EconomyLog', economyLogSchema);
