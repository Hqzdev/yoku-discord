const mongoose = require('mongoose');

const banPoolSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  poolName: {
    type: String,
    required: true,
  },
  servers: [{
    type: String, // Массив серверов, которые участвуют в этом пуле
  }],
  bannedUsers: [{
    userId: String,
    reason: String,
  }],
});

module.exports = mongoose.model('BanPool', banPoolSchema);
