const mongoose = require('mongoose');

const ClanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  leader: { type: String, required: true }, 
  members: { type: [String], required: true }, 
  description: { type: String, default: '' }, 
  createdAt: { type: Date, default: Date.now },
  def: {type: String, Default: 5000},
  prem: {type: String, Default: 10},  
});

module.exports = mongoose.model('Clan', ClanSchema);