import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from 'discord.js';
import { BotClient } from '../Core';

export = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Replies with user info!')
    .addUserOption((option) => option.setName('user')
      .setDescription('The user you would like to look up.')
      .setRequired(true)),

  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user');
    if (!user) return interaction.reply({ content: 'User was not found', ephemeral: true });

    const userinfo = [];
    userinfo.push(`\`IsBot:\` ${user.bot}`);
    userinfo.push(`\`CreatedAt:\` ${user.createdAt}`);
    userinfo.push(`\`CreatedTimeStamp:\` ${user.createdTimestamp}`);
    userinfo.push(`\`DeafultAvatarUrl:\` ${user.defaultAvatarURL}`);
    userinfo.push(`\`Discriminator:\` ${user.discriminator}`);
    userinfo.push(`\`DMChannel:\` ${user.dmChannel}`);
    userinfo.push(`\`Flags:\` ${JSON.stringify(user.flags)}`);
    userinfo.push(`\`IsSystem:\` ${user.system}`);
    userinfo.push(`\`UserID:\` ${user.id}`);
    userinfo.push(`\`Tag:\` ${user.tag}`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.defaultAvatarURL })
      .setColor(user.hexAccentColor ?? 0x0099FF)
      .setDescription(userinfo.join('\n'))
      .setImage(user.avatarURL({ extension: 'png', size: 4096 }));

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
}
