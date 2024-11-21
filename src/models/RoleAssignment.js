const mongoose = require('mongoose');

const RoleAssignmentSchema = new mongoose.Schema({
  guildId: String,      // ID сервера
  roles: [String],      // Список ролей для автоматической выдачи
  autoAssignEnabled: {  // Флаг, включена ли авто-выдача
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('RoleAssignment', RoleAssignmentSchema);
