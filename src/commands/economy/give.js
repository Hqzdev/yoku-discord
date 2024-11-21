const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User'); 
const UserSettings = require('../../models/UserSettings'); 
module.exports = {
  name: 'give',
  description: 'Give currency to another user!',
  options: [
    {
      name: 'user',
      description: 'Select a user to give currency to',
      type: 6, // Тип 6 - для выбора пользователя
      required: true,
    },
    {
      name: 'amount',
      description: 'How much currency do you want to give?',
      type: 4, // Тип 4 - целое число
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const userSettings = await UserSettings.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
    const embedColor = userSettings ? userSettings.systemColor : '#303135';
    if (!interaction.inGuild()) {
      const embed = new EmbedBuilder()
        .setColor('#303135')
        .setDescription('<:freeiconcross391116:1288790867204898846>  | You can only run this command inside a server.');

      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    try {
      await interaction.deferReply();

      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      // Получаем данные отправителя
      let sender = await User.findOne({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      });

      if (!sender || sender.balance < amount) {
        const embed = new EmbedBuilder()
          .setColor('#303135')
          .setDescription('<:freeiconcross391116:1288790867204898846>  | You don\'t have enough currency to complete this transaction.');
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Получаем данные получателя
      let recipient = await User.findOne({
        userId: targetUser.id,
        guildId: interaction.guild.id,
      });

      if (!recipient) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
          .setDescription(`<:freeiconcross391116:1288790867204898846>  | <@${targetUser.id}> doesn't have a profile yet.`);
        interaction.editReply({ embeds: [embed] });
        return;
      }

      // Обновляем баланс отправителя и получателя
      sender.default -= amount;
      recipient.default += amount;

      await sender.save();
      await recipient.save();

      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription(`<:freeiconcheckbox1168610:1288790836712308779> |  You have successfully transferred **${amount}** coins to <@${targetUser.id}>.`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`Error with /give: ${error}`);
      const embed = new EmbedBuilder()
      .setColor(embedColor)
        .setDescription('<:freeiconcheckbox1168610:1288790836712308779> |  An error occurred while trying to complete the transaction.');
      interaction.editReply({ embeds: [embed] });
    }
  },
};
