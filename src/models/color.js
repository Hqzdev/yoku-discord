const userSchema = new mongoose.Schema({
    userId: String,
    guildId: String,
    default: Number,
    premium: Number,
    color: { type: String, default: '#303135' } // Поле для хранения пользовательского цвета
  });
  