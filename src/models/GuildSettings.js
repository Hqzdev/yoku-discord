const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  joinMessageEnabled: { type: Boolean, default: false },
  leaveMessageEnabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
