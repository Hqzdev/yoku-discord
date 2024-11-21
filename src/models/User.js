const { Schema, model } = require('mongoose')

const userSchema = new Schema({
userId: {
    type: String,
    required: true,
},
guildId: {
    type: String,
    required: true,
},
default: {
    type: Number,
    default: 150,
},
premium: {
    type: Number,
    default: 1,
},


})

module.exports = model('User', userSchema);