const mongoose = require('mongoose');

const TempRoleSchema = new mongoose.Schema({
  guildId: String,  // ID сервера
  userId: String,   // ID пользователя
  roleId: String,   // ID роли
  expirationTime: Date, // Время окончания действия роли
});

module.exports = mongoose.model('TempRole', TempRoleSchema);
