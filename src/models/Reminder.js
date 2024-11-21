const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  reminder: { type: String, required: true },
  time: { type: Date, required: true }, // Время, когда напоминание должно быть отправлено
});

module.exports = mongoose.model('Reminder', reminderSchema);
