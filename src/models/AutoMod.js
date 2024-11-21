const mongoose = require('mongoose');

const AutoModeSchema = new mongoose.Schema({
  guildId: String, // ID of the guild (server)
  blockedWords: [String], // Array of blocked words
  antilinkEnabled: { type: Boolean, default: true }, // Enable/disable antilink
  antispamEnabled: { type: Boolean, default: true }, // Enable/disable antispam
});

module.exports = mongoose.model('AutoMode', AutoModeSchema);
