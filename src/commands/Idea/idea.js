const { Builder } = require('canvacord');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

// Инициализируем идеи и идентификатор идеи
const ideas = new Map();
let ideaId = 1;  // Глобальная переменная для увеличения ID идей
const LOG_CHANNEL_ID = '1011160636979429386';

module.exports = {
  name: 'suggest',
  description: 'Submit your idea to the server',
  options: [
    {
      name: 'idea',
      description: 'Describe your idea',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const UserSettings = require('../../models/UserSettings');
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135'; 
    const member = interaction.member;
    const userId = interaction.user.id;
    const userIdea = interaction.options.getString('idea');

    // Проверяем, есть ли уже идеи у этого пользователя, если нет — создаём пустой массив
    if (!ideas.has(userId)) {
      ideas.set(userId, []);
    }

    // Создаем новую идею с уникальным идентификатором и статусом "Pending"
    const newIdea = {
      id: ideaId += 1,  // Увеличиваем ID на 1 с каждой новой идеей
      idea: userIdea,
      status: 'Pending',
    };

    // Добавляем новую идею в список идей пользователя
    ideas.get(userId).push(newIdea);

    // Создаем Embed для подтверждения отправки идеи
    const embed = new EmbedBuilder()
    .setColor(embedColor)
      .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> | Your idea has been submitted and is pending review. Idea ID: **${newIdea.id}**.`);

    interaction.reply({ embeds: [embed], ephemeral: true });

    // Получаем канал логов и отправляем сообщение
    const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      const embedChannel = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`<:emoji_144:1289106597683003424> | __New idea__ (\`ID: ${newIdea.id}\`) from <@${member.id}>: **${userIdea}**`);

      await logChannel.send({ embeds: [embedChannel] });
    } else {
      console.error('Log channel not found.');
    }
  },
};
